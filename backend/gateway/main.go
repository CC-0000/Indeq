package main

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	"github.com/golang/protobuf/jsonpb"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type ServiceClients struct {
	queryClient  pb.QueryServiceClient
	authClient   pb.AuthenticationServiceClient
	integrationClient pb.IntegrationServiceClient
	rabbitMQConn *amqp.Connection
}

func corsMiddleware(next http.Handler) http.Handler {
	// establishes site-wide CORS policies
	allowedIp, ok := os.LookupEnv("ALLOWED_CLIENT_IP")
	if !ok {
		log.Fatal("Failed to retrieve ALLOWED_CLIENT_IP")
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedIp)

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Max-Age", "3600") // tell the browser to cache the pre-flight request for 3600 seconds aka an hour
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func authMiddleware(next http.HandlerFunc, clients *ServiceClients) http.HandlerFunc {
	// simply modifies a handler func to pass these checks first
	return func(w http.ResponseWriter, r *http.Request) {
		auth_header := r.Header.Get("Authorization")
		if auth_header == "" {
			http.Error(w, "No authorization token provided", http.StatusUnauthorized)
			return
		}
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")

		res, err := clients.authClient.Verify(r.Context(), &pb.VerifyRequest{
			Token: auth_token,
		})

		if err != nil || !res.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r) // if they pass the checks serve the next handler
	}
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(&pb.HttpHelloResponse{Message: "Hello, World!"})
}

func handleGetQueryGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("received event stream request")

		// Set up context with cancellation
		ctx, cancel := context.WithCancel(r.Context())
		defer cancel()

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, _ := clients.authClient.Verify(ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		// Get the query parameters
		queryParams := r.URL.Query()
		incomingId := queryParams.Get("conversationId")
		conversationId := fmt.Sprintf("%s-%s", verifyRes.UserId, incomingId)

		// Handle SSE connection
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("Access-Control-Allow-Origin", "*") // this should be updated in the future to only allow frontend connections

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
			conversationId, // name
			false,          // durable
			true,           // delete when unused
			false,          // exclusive
			false,          // no-wait
			amqp.Table{ // arguments
				"x-expires": 300000, // 5 minutes in milliseconds
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
				thisMsg := string(msg.Body)
				jsonData, _ := json.Marshal(struct {
					Type string `json:"type"`
					Data string `json:"data"`
				}{
					Type: "message",
					Data: thisMsg,
				})
				// write it out to the response
				fmt.Fprintf(w, "data: %s\n\n", jsonData)
				flusher.Flush()

				// if the message is blank there are no more messages
				if thisMsg == "" {
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
		newId := uuid.New()
		conversationId := fmt.Sprintf("%s-%s", verifyRes.UserId, newId.String())

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

		// Send the query in a goroutine
		go func() {
			detachedCtx, cancel := context.WithCancel(context.Background())
			defer cancel()
			_, err := clients.queryClient.MakeQuery(detachedCtx, &pb.QueryRequest{
				ConversationId: conversationId,
				Query:          queryRequest.Query,
			})
			if err != nil {
				log.Printf("Error making query: %v", err)
			}
		}()

		httpResponse := &pb.HttpQueryResponse{
			ConversationId: newId.String(),
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

func handleGetIntegrationsGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r * http.Request) {
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
		var connectIntegrationRequest pb.HttpConnectIntegrationRequest
		// Set up context
		ctx := r.Context()

		if err := json.NewDecoder(r.Body).Decode(&connectIntegrationRequest); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		log.Printf("Provider: %s", connectIntegrationRequest.Provider)
		log.Printf("Auth code: %s", connectIntegrationRequest.AuthCode)

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
		
		connectRes, err := clients.integrationClient.ConnectIntegration(ctx, &pb.ConnectIntegrationRequest{
			UserId: verifyRes.UserId,
			Provider: provider,
			AuthCode: connectIntegrationRequest.AuthCode,
		})

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to connect integration: %v", err), http.StatusInternalServerError)
			return
		}

		respBody := &pb.HttpConnectIntegrationResponse{
			Success: connectRes.Success,
			Message: connectRes.Message,
			ErrorDetails: connectRes.ErrorDetails,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(respBody)
	}
}

func handleDisconnectIntegrationGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
			UserId: verifyRes.UserId,
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
			Token: res.Token,
			Error: res.Error,
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
		marshaler := &jsonpb.Marshaler{
			EmitDefaults: true,
		}
		err := marshaler.Marshal(w, httpResponse)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
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
	tlsConfig, err := config.LoadTLSFromEnv("GATEWAY_CRT", "GATEWAY_KEY")
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
		grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
			RootCAs: certPool,
		})),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with auth-service: %v", err)
	}
	defer authConn.Close()
	authServiceClient := pb.NewAuthenticationServiceClient(authConn)

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
	// Save the service clients for future use
	serviceClients := &ServiceClients{
		queryClient:  queryServiceClient,
		authClient:   authServiceClient,
		integrationClient: integrationServiceClient,
		rabbitMQConn: rabbitMQConn,
	}
	log.Print("Server has established connection with other services")

	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello", helloHandler)
	mux.HandleFunc("POST /api/query", authMiddleware(handlePostQueryGenerator(serviceClients), serviceClients))
	mux.HandleFunc("GET /api/query", authMiddleware(handleGetQueryGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/register", handleRegisterGenerator(serviceClients))
	mux.HandleFunc("POST /api/login", handleLoginGenerator(serviceClients))
	mux.HandleFunc("POST /api/verify", handleVerifyGenerator(serviceClients))
	mux.HandleFunc("POST /api/connect", authMiddleware(handleConnectIntegrationGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/disconnect", authMiddleware(handleDisconnectIntegrationGenerator(serviceClients), serviceClients))
	mux.HandleFunc("GET /api/integrations", authMiddleware(handleGetIntegrationsGenerator(serviceClients), serviceClients))
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
