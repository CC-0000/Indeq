package main

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"bytes"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/protobuf/encoding/protojson"
)

type ServiceClients struct {
	queryClient       pb.QueryServiceClient
	authClient        pb.AuthenticationServiceClient
	integrationClient pb.IntegrationServiceClient
	waitlistClient    pb.WaitlistServiceClient
	desktopClient     pb.DesktopServiceClient
	rabbitMQConn      *amqp.Connection
	crawlingClient    pb.CrawlingServiceClient
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	log.Print("hello request received")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(&pb.HttpHelloResponse{Message: "Hello, World!"})
}

func handleDeleteConversation(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print("received delete conversation request")

		ctx := r.Context()

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, _ := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		var deleteConversationRequest pb.QueryDeleteConversationRequest
		if err := json.NewDecoder(r.Body).Decode(&deleteConversationRequest); err != nil {
			http.Error(w, "Invalid Formatting", http.StatusBadRequest)
			return
		}

		// Delete the conversation from the database
		_, err := clients.queryClient.DeleteConversation(ctx, &pb.QueryDeleteConversationRequest{
			UserId:         verifyRes.UserId,
			ConversationId: deleteConversationRequest.ConversationId,
		})
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func handleGetConversationHistoryGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print("received get conversation history request")

		ctx := r.Context()

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, _ := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		var getConversationRequest pb.HttpQueryGetConversationRequest
		if err := json.NewDecoder(r.Body).Decode(&getConversationRequest); err != nil {
			http.Error(w, "Invalid Formatting", http.StatusBadRequest)
			return
		}

		// Get the conversation history from the database
		getConversationResponse, err := clients.queryClient.GetConversation(ctx, &pb.QueryGetConversationRequest{
			UserId:         verifyRes.UserId,
			ConversationId: getConversationRequest.ConversationId,
		})
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		httpResponse := &pb.HttpQueryGetConversationResponse{
			Conversation: &pb.HttpConversation{
				Title:          getConversationResponse.Conversation.Title,
				ConversationId: getConversationResponse.Conversation.ConversationId,
				FullMessages:   getConversationResponse.Conversation.FullMessages,
			},
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func handleGetAllConversationsGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print("received get all conversations request")

		ctx := r.Context()

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, _ := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		conversationsRes, err := clients.queryClient.GetAllConversations(ctx, &pb.QueryGetAllConversationsRequest{
			UserId: verifyRes.UserId,
		})
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		httpResponse := &pb.HttpQueryGetAllConversationsResponse{
			ConversationHeaders: conversationsRes.ConversationHeaders,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func handleGetQueryGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("received event stream request")

		// Set up context with cancellation
		ctx, cancel := context.WithCancel(r.Context())
		defer cancel()

		// get the ttl
		queue_ttl, err := strconv.ParseUint(os.Getenv("QUERY_QUEUE_TTL"), 10, 32)
		if err != nil {
			log.Fatal("failed to find the query queue ttl in env variables")
		}
		queueTTL := int(queue_ttl)

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, _ := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		// Get the query parameters
		queryParams := r.URL.Query()
		incomingId := queryParams.Get("requestId")
		requestId := fmt.Sprintf("%s-%s", verifyRes.UserId, incomingId)

		// Handle SSE connection
		allowedOrigins, ok := os.LookupEnv("ALLOWED_CLIENT_IP")
		if !ok {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigins) // this should be updated in the future to only allow frontend connections

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
			return
		}

		// Create a rabbitMQ channel
		channel, err := clients.rabbitMQConn.Channel()
		if err != nil {
			log.Fatal(err)
		}
		defer channel.Close()

		queue, err := channel.QueueDeclare(
			requestId, // name
			false,     // durable
			true,      // delete when unused
			false,     // exclusive
			false,     // no-wait
			amqp.Table{ // arguments
				"x-expires": queueTTL,
			},
		)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		msgs, err := channel.Consume(
			queue.Name,
			"",    // consumer
			true,  // auto-ack
			false, // exclusive
			false, // no-local
			false,
			nil,
		)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		log.Print("Starting to read...")
		for {
			select {
			case <-ctx.Done():
				log.Print("Closing connection from gateway...")
				return
			case msg, ok := <-msgs: // there is a message in the channel
				if !ok {
					return
				}
				// parse the message into json
				var msgJson map[string]any
				json.Unmarshal(msg.Body, &msgJson)

				// write it out to the response
				fmt.Fprintf(w, "data: %s\n\n", msg.Body)
				flusher.Flush()

				// if the message is blank there are no more messages
				if msgJson["type"] == "end" {
					return
				}
			}
		}
	}
}

func handlePostQueryGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// Set up context
		ctx := r.Context()

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, _ := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		// Generate a per-request UUID
		newRequestId := uuid.New().String()
		userHashedRequestId := fmt.Sprintf("%s-%s", verifyRes.UserId, newRequestId)

		// Grab the query
		var queryRequest pb.HttpQueryRequest
		if err := json.NewDecoder(r.Body).Decode(&queryRequest); err != nil {
			http.Error(w, "Invalid Formatting", http.StatusBadRequest)
			return
		}
		if queryRequest.Query == "" {
			http.Error(w, "Invalid Formatting", http.StatusBadRequest)
			return
		}

		// check to see if the conversation id exists or create a new one if it doesn't
		conversationId := queryRequest.ConversationId
		_, err := clients.queryClient.GetConversation(ctx, &pb.QueryGetConversationRequest{
			UserId:         verifyRes.UserId,
			ConversationId: queryRequest.ConversationId,
		})
		if err != nil {
			if !strings.Contains(err.Error(), "COULD_NOT_FIND_CONVERSATION") {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				log.Print("error encountered when checking for conversation: ", err)
				return
			} else {
				// this means we need to create a new conversation
				startNewConvRes, err := clients.queryClient.StartNewConversation(ctx, &pb.StartNewConversationRequest{
					UserId: verifyRes.UserId,
					Query:  queryRequest.Query,
				})
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					log.Print("error encountered when starting new conversation: ", err)
					return
				}

				conversationId = startNewConvRes.ConversationId
			}
		}

		// Send the query in a goroutine
		go func() {
			detachedCtx, cancel := context.WithCancel(context.Background())
			defer cancel()
			_, err := clients.queryClient.MakeQuery(detachedCtx, &pb.QueryRequest{
				UserId:         verifyRes.UserId,
				RequestId:      userHashedRequestId,
				ConversationId: conversationId,
				Query:          queryRequest.Query,
			})
			if err != nil {
				log.Printf("Error making query: %v", err)
			}
		}()

		httpResponse := &pb.HttpQueryResponse{
			RequestId:      newRequestId,
			ConversationId: conversationId,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func stringToEnumProvider(provider string) (pb.Provider, error) {
	switch strings.ToLower(provider) {
	case "google":
		return pb.Provider_GOOGLE, nil
	case "microsoft":
		return pb.Provider_MICROSOFT, nil
	case "notion":
		return pb.Provider_NOTION, nil
	default:
		return pb.Provider_PROVIDER_UNSPECIFIED, fmt.Errorf("invalid provider: %s", provider)
	}
}

func handleOAuthURLGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var getOAuthURLRequest pb.HttpGetOAuthURLRequest
		log.Println("Received request to get OAuth URL")
		ctx := r.Context()

		if err := json.NewDecoder(r.Body).Decode(&getOAuthURLRequest); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		if getOAuthURLRequest.Provider == "" {
			http.Error(w, "Missing provider", http.StatusBadRequest)
			return
		}
		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, err := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		if err != nil || !verifyRes.Valid {
			log.Println("Invalid token")
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		provider, err := stringToEnumProvider(getOAuthURLRequest.Provider)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		oAuthURLRes, err := clients.integrationClient.GetOAuthURL(ctx, &pb.GetOAuthURLRequest{
			Provider: provider,
			UserId:   verifyRes.UserId,
		})
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to get OAuth URL: %v", err), http.StatusInternalServerError)
			return
		}

		respBody := &pb.HttpGetOAuthURLResponse{
			Url: oAuthURLRes.Url,
		}
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(respBody)
	}
}

func handleSSOOAuthGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to handle SSO login")
		var getOAuthURLRequest pb.HttpGetOAuthURLRequest
		ctx := r.Context()

		if err := json.NewDecoder(r.Body).Decode(&getOAuthURLRequest); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		if getOAuthURLRequest.Provider == "" {
			http.Error(w, "Missing provider", http.StatusBadRequest)
			return
		}

		provider, err := stringToEnumProvider(getOAuthURLRequest.Provider)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		oAuthURLRes, err := clients.integrationClient.GetSSOURL(ctx, &pb.GetSSOURLRequest{
			Provider: provider,
		})
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to get SSO URL: %v", err), http.StatusInternalServerError)
			return
		}

		respBody := &pb.HttpGetOAuthURLResponse{
			Url: oAuthURLRes.Url,
		}
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(respBody)
	}
}

func handleGetIntegrationsGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to get users integrations")
		// Set up context
		ctx := r.Context()

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, err := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		if err != nil || !verifyRes.Valid {
			log.Println("Invalid token")
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		res, err := clients.integrationClient.GetIntegrations(ctx, &pb.GetIntegrationsRequest{
			UserId: verifyRes.UserId,
		})

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to get integrations: %v", err), http.StatusInternalServerError)
			return
		}

		response := &pb.HttpGetIntegrationsResponse{
			Providers: make([]string, len(res.Providers)),
		}
		for i, provider := range res.Providers {
			response.Providers[i] = provider.String()
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func handleConnectIntegrationGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to connect integration")
		var connectIntegrationRequest pb.HttpConnectIntegrationRequest
		// Set up context
		ctx := r.Context()

		if err := json.NewDecoder(r.Body).Decode(&connectIntegrationRequest); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		if connectIntegrationRequest.Provider == "" || connectIntegrationRequest.AuthCode == "" {
			log.Println("Missing provider or auth code")
			http.Error(w, "Missing provider or auth code", http.StatusBadRequest)
			return
		}

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, err := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		if err != nil || !verifyRes.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		provider, err := stringToEnumProvider(connectIntegrationRequest.Provider)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// check state from redis
		if connectIntegrationRequest.State == "" {
			log.Println("Missing state")
			http.Error(w, "Missing state", http.StatusBadRequest)
			return
		}

		validateRes, err := clients.integrationClient.ValidateOAuthState(ctx, &pb.ValidateOAuthStateRequest{
			State: connectIntegrationRequest.State,
		})

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to validate oauth state: %v", err), http.StatusInternalServerError)
			return
		}

		if !validateRes.Success {
			http.Error(w, validateRes.ErrorDetails, http.StatusBadRequest)
			return
		}

		if validateRes.UserId != verifyRes.UserId {
			http.Error(w, "User ID mismatch in OAuth state", http.StatusForbidden)
			return
		}

		connectRes, err := clients.integrationClient.ConnectIntegration(ctx, &pb.ConnectIntegrationRequest{
			UserId:   validateRes.UserId,
			Provider: provider,
			AuthCode: connectIntegrationRequest.AuthCode,
		})

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to connect integration: %v", err), http.StatusInternalServerError)
			return
		}

		respBody := &pb.HttpConnectIntegrationResponse{
			Success:      connectRes.Success,
			Message:      connectRes.Message,
			ErrorDetails: connectRes.ErrorDetails,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(respBody)
	}
}

// handleSSOLoginGenerator handles the OAuth callback for SSO flows
// This is specifically for unauthenticated users who are signing in with Google SSO
func handleSSOLoginGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var ssoConnectRequest pb.HttpSSOConnectRequest
		// Set up context
		ctx := r.Context()

		if err := json.NewDecoder(r.Body).Decode(&ssoConnectRequest); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		if ssoConnectRequest.Provider == "" {
			log.Println("Missing provider")
			http.Error(w, "Missing provider", http.StatusBadRequest)
			return
		}

		// Check if the authorization code is empty
		if ssoConnectRequest.AuthCode == "" {
			log.Println("Missing authorization code")
			http.Error(w, "Missing authorization code", http.StatusBadRequest)
			return
		}

		// Check if the environment variables are properly set
		clientID := os.Getenv("GOOGLE_SSO_CLIENT_ID")
		clientSecret := os.Getenv("GOOGLE_SSO_CLIENT_SECRET")
		redirectURI := os.Getenv("GOOGLE_SSO_REDIRECT_URI")

		if clientID == "" {
			log.Println("Missing GOOGLE_SSO_CLIENT_ID environment variable")
			http.Error(w, "Server configuration error", http.StatusInternalServerError)
			return
		}

		if clientSecret == "" {
			log.Println("Missing GOOGLE_SSO_CLIENT_SECRET environment variable")
			http.Error(w, "Server configuration error", http.StatusInternalServerError)
			return
		}

		if redirectURI == "" {
			log.Println("Missing GOOGLE_SSO_REDIRECT_URI environment variable")
			http.Error(w, "Server configuration error", http.StatusInternalServerError)
			return
		}

		// Check state from redis
		if ssoConnectRequest.State == "" {
			log.Println("Missing state")
			http.Error(w, "Missing state", http.StatusBadRequest)
			return
		}

		// For SSO flows, we expect the state to have the "sso:" prefix
		// This is set in the GetSSOURL function
		ssoState := "sso:" + ssoConnectRequest.State
		
		validateRes, err := clients.integrationClient.ValidateOAuthState(ctx, &pb.ValidateOAuthStateRequest{
			State: ssoState,
		})

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to validate SSO state: %v", err), http.StatusInternalServerError)
			return
		} else {
			log.Println("SSO state validated")
		}

		if !validateRes.Success {
			http.Error(w, validateRes.ErrorDetails, http.StatusBadRequest)
			return
		}
		
		// Exchange the authorization code for tokens
		tokenURL := "https://oauth2.googleapis.com/token"
		data := url.Values{}
		data.Set("code", ssoConnectRequest.AuthCode)
		data.Set("client_id", os.Getenv("GOOGLE_SSO_CLIENT_ID"))
		data.Set("client_secret", os.Getenv("GOOGLE_SSO_CLIENT_SECRET"))
		data.Set("redirect_uri", os.Getenv("GOOGLE_SSO_REDIRECT_URI"))
		data.Set("grant_type", "authorization_code")
		
		// Create the request manually to see what's being sent
		req, err := http.NewRequest("POST", tokenURL, strings.NewReader(data.Encode()))
		if err != nil {
			http.Error(w, "Failed to create token exchange request", http.StatusInternalServerError)
			return
		}
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		
		// Send the request
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			http.Error(w, "Failed to exchange code for tokens", http.StatusInternalServerError)
			return
		}
		// Create a new reader with the body bytes for subsequent json.Decode
		var bodyBytes []byte
		bodyBytes, err = io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Failed to read response body", http.StatusInternalServerError)
			return
		}
		
		defer resp.Body.Close()

		var tokenResp struct {
			AccessToken  string `json:"access_token"`
			TokenType    string `json:"token_type"`
			ExpiresIn    int    `json:"expires_in"`
			RefreshToken string `json:"refresh_token"`
			Scope        string `json:"scope"`
		}

		// Decode the token response
		if err := json.Unmarshal(bodyBytes, &tokenResp); err != nil {
			http.Error(w, "Failed to decode token response", http.StatusInternalServerError)
			return
		}

		// Check if we got an access token
		if tokenResp.AccessToken == "" {
			http.Error(w, "Failed to get access token", http.StatusInternalServerError)
			return
		}

		// Use the access token to get the user's email from Google
		userInfoURL := "https://www.googleapis.com/oauth2/v2/userinfo"
		req, err = http.NewRequest("GET", userInfoURL, nil)
		if err != nil {
			http.Error(w, "Failed to create user info request", http.StatusInternalServerError)
			return
		}

		req.Header.Set("Authorization", "Bearer "+tokenResp.AccessToken)
		userInfoResp, err := http.DefaultClient.Do(req)
		if err != nil {
			http.Error(w, "Failed to get user info", http.StatusInternalServerError)
			return
		}
		
		// Read and log the response body
		bodyBytes, err = io.ReadAll(userInfoResp.Body)
		if err != nil {
			log.Printf("Failed to read response body: %v", err)
			http.Error(w, "Failed to read response body", http.StatusInternalServerError)
			return
		}
		
		// Check if the response is successful
		if userInfoResp.StatusCode != http.StatusOK {
			log.Printf("Failed to get user info: status=%d, body=%s", 
				userInfoResp.StatusCode, string(bodyBytes))
			http.Error(w, "Failed to get user info", http.StatusInternalServerError)
			return
		}
		
		// Create a new reader with the body bytes for subsequent decoding
		userInfoResp.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
		defer userInfoResp.Body.Close()

		var userInfo struct {
			ID            string `json:"id"`
			Email         string `json:"email"`
			VerifiedEmail bool   `json:"verified_email"`
			Name          string `json:"name"`
			Picture       string `json:"picture"`
		}

		if err := json.NewDecoder(userInfoResp.Body).Decode(&userInfo); err != nil {
			log.Printf("Failed to decode user info: %v, body: %s", err, string(bodyBytes))
			http.Error(w, "Failed to decode user info", http.StatusInternalServerError)
			return
		}

		// Check if we got the required user info
		if userInfo.Email == "" {
			log.Printf("No email in user info response: %s", string(bodyBytes))
			http.Error(w, "Failed to get user email", http.StatusInternalServerError)
			return
		}

		// Call authentication service to create/update Google user
		userResponse, err := clients.authClient.CreateOrUpdateGoogleUser(ctx, &pb.CreateOrUpdateGoogleUserRequest{
			GoogleId: userInfo.ID,
			Name:    userInfo.Name,
			Email:   userInfo.Email,
		})

		if err != nil {
			log.Printf("Failed to create/update user: %v", err)
			http.Error(w, "Failed to create/update user", http.StatusInternalServerError)
			return
		}
		
		respBody := &pb.HttpSSOConnectResponse{
			Success:      true,
			Message:      "Successfully authenticated with Google",
			ErrorDetails: "",
			Token:        userResponse.Token,
			UserId:       userResponse.UserId,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(respBody)
	}
}

func handleDisconnectIntegrationGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to disconnect integration")
		var disconnectIntegrationRequest pb.HttpDisconnectIntegrationRequest
		// Set up context
		ctx := r.Context()

		if err := json.NewDecoder(r.Body).Decode(&disconnectIntegrationRequest); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}
		if disconnectIntegrationRequest.Provider == "" {
			http.Error(w, "Missing provider", http.StatusBadRequest)
			return
		}

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, err := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		if err != nil || !verifyRes.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		provider, err := stringToEnumProvider(disconnectIntegrationRequest.Provider)
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid provider: %v", err), http.StatusBadRequest)
			return
		}

		disconnectRes, err := clients.integrationClient.DisconnectIntegration(ctx, &pb.DisconnectIntegrationRequest{
			UserId:   verifyRes.UserId,
			Provider: provider,
		})

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to disconnect integration: %v", err), http.StatusInternalServerError)
			return
		}

		respBody := &pb.HttpDisconnectIntegrationResponse{
			Success: disconnectRes.Success,
			Message: disconnectRes.Message,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(respBody)
	}
}

func handleAddToWaitlist(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var addToWaitlistRequest pb.HttpAddToWaitlistRequest
		log.Println("Received add to waitlist request")
		if err := json.NewDecoder(r.Body).Decode(&addToWaitlistRequest); err != nil {
			log.Printf("Error: %v", err)
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// Call the waitlist service
		res, err := clients.waitlistClient.AddToWaitlist(r.Context(), &pb.AddToWaitlistRequest{
			Email: addToWaitlistRequest.Email,
		})
		if err != nil {
			http.Error(w, "Failed to add to waitlist", http.StatusInternalServerError)
			return
		}
		httpResponse := &pb.HttpAddToWaitlistResponse{
			Success: res.Success,
			Message: res.Message,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func handleGetDesktopStatsGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set up context
		ctx := r.Context()

		// NOTE: expects authentication middleware to have already verified the token
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, err := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})
		if err != nil {
			http.Error(w, "Failed to verify token", http.StatusInternalServerError)
			return
		}

		// Get the desktop stats for the user
		res, err := clients.desktopClient.GetCrawlStats(ctx, &pb.GetCrawlStatsRequest{
			UserId: verifyRes.UserId,
		})
		if err != nil {
			log.Printf("Error getting desktop stats: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Return the response using the proto message definition
		httpResponse := &pb.HttpGetDesktopStatsResponse{
			CrawledFiles: res.CrawledFiles,
			TotalFiles:   res.TotalFiles,
			IsCrawling:   res.IsCrawling,
			IsOnline:     res.IsOnline,
		}

		jsonBytes, err := protojson.MarshalOptions{
			EmitUnpopulated: true,
		}.Marshal(httpResponse)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonBytes)
	}
}

func handleRegisterGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var registerRequest pb.HttpRegisterRequest
		log.Println("Received register request")
		if err := json.NewDecoder(r.Body).Decode(&registerRequest); err != nil {
			log.Printf("Error: %v", err)
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// Call the register service
		res, err := clients.authClient.Register(r.Context(), &pb.RegisterRequest{
			Email:    registerRequest.Email,
			Name:     registerRequest.Name,
			Password: registerRequest.Password,
		})

		if err != nil {
			log.Print(err)
			http.Error(w, "Failed to register user", http.StatusInternalServerError)
			return
		}

		httpResponse := &pb.HttpRegisterResponse{
			Success: res.GetSuccess(),
			Error:   res.GetError(),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func handleLoginGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginRequest pb.HttpLoginRequest
		log.Println("Received login request")
		if err := json.NewDecoder(r.Body).Decode(&loginRequest); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
		}

		// Call the login service
		res, err := clients.authClient.Login(r.Context(), &pb.LoginRequest{
			Email:    loginRequest.Email,
			Password: loginRequest.Password,
		})

		if err != nil {
			http.Error(w, "Failed to login", http.StatusInternalServerError)
			return
		}

		httpResponse := &pb.HttpLoginResponse{
			Token:  res.Token,
			UserId: res.UserId,
			Error:  res.Error,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func handleVerifyGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received verify request")

		valid := false
		auth_header := r.Header.Get("Authorization")
		if auth_header != "" {
			auth_token := strings.TrimPrefix(auth_header, "Bearer ")

			res, err := clients.authClient.Verify(r.Context(), &pb.VerifyRequest{
				Token: auth_token,
			})

			if err == nil && res.Valid {
				valid = true
			}
		}

		httpResponse := &pb.HttpVerifyResponse{
			Valid: valid,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func handleSignCSRGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("received sign csr request")
		var csrRequest pb.HttpCSRRequest

		if err := json.NewDecoder(r.Body).Decode(&csrRequest); err != nil {
			log.Printf("[HTTP 400] failed to decode the incoming csr request: %v", err)
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// try to make a csr request
		csrRes, err := clients.authClient.SignCSR(r.Context(), &pb.SignCSRRequest{
			CsrBase64: csrRequest.CsrBase64,
			LoginRequest: &pb.LoginRequest{
				Email:    csrRequest.Email,
				Password: csrRequest.Password,
			},
		})

		if err != nil {
			log.Printf("[HTTP 500] failed to make the csr signing request: %v", err)
			http.Error(w, "Failed to sign csr", http.StatusInternalServerError)
			return
		}

		httpResponse := &pb.HttpCSRResponse{
			CertificateBase64: csrRes.CertificateBase64,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func handleManualCrawlGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received manual crawl request")

		ctx := r.Context()
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, err := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		if err != nil || !verifyRes.Valid {
			log.Println("Invalid token")
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		res, err := clients.crawlingClient.ManualCrawler(ctx, &pb.ManualCrawlerRequest{
			UserId: verifyRes.UserId,
		})
		if err != nil {
			log.Printf("Error updating crawler: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}

func main() {
	// Load .env variables
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Load CA certificate from .env
	caCertB64 := os.Getenv("CA_CRT")
	caCert, err := base64.StdEncoding.DecodeString(caCertB64)
	if err != nil {
		log.Fatalf("failed to decode CA cert: %v", err)
	}

	certPool := x509.NewCertPool()
	if !certPool.AppendCertsFromPEM(caCert) {
		log.Fatal("failed to add CA certificate")
	}

	// Load TLS Config
	tlsConfig, err := config.LoadServerTLSFromEnv("GATEWAY_CRT", "GATEWAY_KEY")
	if err != nil {
		log.Fatal("Error loading TLS config for gateway service")
	}

	// Connect to RabbitMQ
	rabbitMQConn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer rabbitMQConn.Close()

	// Connect to the query service
	clientConfig, err := config.LoadClientTLSFromEnv("GATEWAY_CRT", "GATEWAY_KEY", "CA_CRT")
	if err != nil {
		log.Fatal(err)
	}
	queryConn, err := grpc.NewClient(
		os.Getenv("QUERY_ADDRESS"),
		grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
			RootCAs: certPool,
		})),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with query-service: %v", err)
	}
	defer queryConn.Close()
	queryServiceClient := pb.NewQueryServiceClient(queryConn)

	// Connect to the authentication service
	authConn, err := grpc.NewClient(
		os.Getenv("AUTH_ADDRESS"),
		grpc.WithTransportCredentials(credentials.NewTLS(clientConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with auth-service: %v", err)
	}
	defer authConn.Close()
	authServiceClient := pb.NewAuthenticationServiceClient(authConn)
	if _, err = authServiceClient.Login(context.Background(), &pb.LoginRequest{}); err != nil {
		log.Fatal(err)
	}

	// Connect to the integration service
	integrationConn, err := grpc.NewClient(
		os.Getenv("INTEGRATION_ADDRESS"),
		grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
			RootCAs: certPool,
		})),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with integration-service: %v", err)
	}
	defer integrationConn.Close()
	integrationServiceClient := pb.NewIntegrationServiceClient(integrationConn)

	//Connect to the crawling service
	crawlingConn, err := grpc.NewClient(
		os.Getenv("CRAWLING_ADDRESS"),
		grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
			RootCAs: certPool,
		})),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with crawling-service: %v", err)
	}
	defer crawlingConn.Close()
	crawlingServiceClient := pb.NewCrawlingServiceClient(crawlingConn)

	// Connect to the waitlist service
	waitlistConn, err := grpc.NewClient(
		os.Getenv("WAITLIST_ADDRESS"),
		grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
			RootCAs: certPool,
		})),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with waitlist-service: %v", err)
	}
	defer waitlistConn.Close()
	waitlistServiceClient := pb.NewWaitlistServiceClient(waitlistConn)

	// Connect to the desktop service
	desktopConn, err := grpc.NewClient(
		os.Getenv("DESKTOP_ADDRESS"),
		grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
			RootCAs: certPool,
		})),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with desktop-service: %v", err)
	}
	defer desktopConn.Close()
	desktopServiceClient := pb.NewDesktopServiceClient(desktopConn)

	// Save the service clients for future use
	serviceClients := &ServiceClients{
		queryClient:       queryServiceClient,
		authClient:        authServiceClient,
		waitlistClient:    waitlistServiceClient,
		desktopClient:     desktopServiceClient,
		crawlingClient:    crawlingServiceClient,
		rabbitMQConn:      rabbitMQConn,
		integrationClient: integrationServiceClient,
	}
	log.Print("Server has established connection with other services")

	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello", helloHandler)
	mux.HandleFunc("POST /api/query", authMiddleware(handlePostQueryGenerator(serviceClients), serviceClients))
	mux.HandleFunc("GET /api/query", authMiddleware(handleGetQueryGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/delete_conversation", authMiddleware(handleDeleteConversation(serviceClients), serviceClients))
	mux.HandleFunc("GET /api/get_all_conversations", authMiddleware(handleGetAllConversationsGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/get_conversation_history", authMiddleware(handleGetConversationHistoryGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/register", handleRegisterGenerator(serviceClients))
	mux.HandleFunc("POST /api/login", handleLoginGenerator(serviceClients))
	mux.HandleFunc("POST /api/verify", handleVerifyGenerator(serviceClients))
	mux.HandleFunc("POST /api/csr", handleSignCSRGenerator(serviceClients))
	mux.HandleFunc("POST /api/connect", authMiddleware(handleConnectIntegrationGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/disconnect", authMiddleware(handleDisconnectIntegrationGenerator(serviceClients), serviceClients))
	mux.HandleFunc("GET /api/integrations", authMiddleware(handleGetIntegrationsGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/oauth", handleOAuthURLGenerator(serviceClients))
	mux.HandleFunc("POST /api/ssooauth", handleSSOOAuthGenerator(serviceClients))
	mux.HandleFunc("POST /api/ssologin", handleSSOLoginGenerator(serviceClients))
	mux.HandleFunc("POST /api/waitlist", handleAddToWaitlist(serviceClients))
	mux.HandleFunc("GET /api/desktop_stats", authMiddleware(handleGetDesktopStatsGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/manualcrawl", authMiddleware(handleManualCrawlGenerator(serviceClients), serviceClients))

	httpPort := os.Getenv("GATEWAY_ADDRESS")
	server := &http.Server{
		Addr:      httpPort,
		Handler:   corsMiddleware(mux),
		TLSConfig: tlsConfig,
	}

	log.Printf("Starting server on %s", server.Addr)
	if os.Getenv("DEV_PROD") == "prod" {
		if err := server.ListenAndServeTLS("", ""); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	} else {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}
}
