package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type ServiceClients struct {
	queryClient pb.QueryServiceClient
	authClient pb.AuthenticationServiceClient
	integrationClient pb.IntegrationServiceClient
	rabbitMQConn *amqp.Connection
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
	json.NewEncoder(w).Encode(HelloResponse{Message: "Hello, World!"})
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
            false,           // durable
            true,           // delete when unused
            false,           // exclusive
            false,           // no-wait
			amqp.Table{ 		// arguments
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
		var queryRequest QueryRequest
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
				Query:  queryRequest.Query,
			})
			if err != nil {
				log.Printf("Error making query: %v", err)
			}
		}()

		httpResponse := &QueryResponse{
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

		response := struct {
			Providers []string `json:"providers"`
		}{}

		for _, provider := range res.Providers {
			response.Providers = append(response.Providers, provider.String())
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func handleConnectIntegrationGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		
		// Set up context
		ctx := r.Context()

		var reqBody ConnectIntegrationRequest
		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}
		if reqBody.Provider == "" || reqBody.AuthCode == "" {
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

		provider, err := stringToEnumProvider(reqBody.Provider)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		
		connectRes, err := clients.integrationClient.ConnectIntegration(ctx, &pb.ConnectIntegrationRequest{
			UserId: verifyRes.UserId,
			Provider: provider,
			AuthCode: reqBody.AuthCode,
		})
		
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to connect integration: %v", err), http.StatusInternalServerError)
			return
		}

		respBody := &ConnectIntegrationResponse{
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
		// Set up context
		ctx := r.Context()

		var reqBody DisconnectIntegrationRequest
		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}
		if reqBody.Provider == "" {
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

		provider, err := stringToEnumProvider(reqBody.Provider)
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

		respBody := &DisconnectIntegrationResponse{
			Success: disconnectRes.Success,
			Message: disconnectRes.Message,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(respBody)
	}
}


func handleRegisterGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var registerRequest RegisterRequest
		log.Println("Received register request")
		if err := json.NewDecoder(r.Body).Decode(&registerRequest); err != nil {
			log.Printf("Error: %v", err)
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// Call the register service
		res, err := clients.authClient.Register(r.Context(), &pb.RegisterRequest{
			Email: registerRequest.Email,
			Name: registerRequest.Name,
			Password: registerRequest.Password,
		})

		if err != nil {
			http.Error(w, "Failed to register user", http.StatusInternalServerError)
			return
		}

		httpResponse := &RegisterResponse{
			Success: res.GetSuccess(),
			Error: res.GetError(),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func handleLoginGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginRequest LoginRequest
		log.Println("Received login request")
		if err := json.NewDecoder(r.Body).Decode(&loginRequest); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
		}

		// Call the login service
		res, err := clients.authClient.Login(r.Context(), &pb.LoginRequest{
			Email: loginRequest.Email,
			Password: loginRequest.Password,
		})

		if err != nil {
			http.Error(w, "Failed to login", http.StatusInternalServerError)
			return
		}

		httpResponse := &LoginResponse{
			Token: res.Token,
			Error: res.Error,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(httpResponse)
	}
}

func main() {
	// Load .env variables
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Connect to RabbitMQ
	rabbitMQConn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer rabbitMQConn.Close()

	// Connect to the query service
    queryConn, err := grpc.NewClient(
        os.Getenv("QUERY_ADDRESS"), // Target address
        grpc.WithTransportCredentials(insecure.NewCredentials()), // Required for plaintext
    )
	if err != nil {
		log.Fatalf("Failed to establish connection with query-service: %v", err)
	}
	defer queryConn.Close()
	queryServiceClient := pb.NewQueryServiceClient(queryConn)

	// Connect to the authentication service
	authConn, err := grpc.NewClient(
		os.Getenv("AUTH_ADDRESS"), 
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with auth-service: %v", err)
	}
	defer authConn.Close()
	authServiceClient := pb.NewAuthenticationServiceClient(authConn)

	// Connect to the integration service
	integrationConn, err := grpc.NewClient(
		os.Getenv("INTEGRATION_ADDRESS"),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with integration-service: %v", err)
	}
	defer integrationConn.Close()
	integrationServiceClient := pb.NewIntegrationServiceClient(integrationConn)
	// Save the service clients for future use
	serviceClients := &ServiceClients{
		queryClient: queryServiceClient, 
		authClient: authServiceClient,
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
	mux.HandleFunc("POST /api/connect", authMiddleware(handleConnectIntegrationGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/disconnect", authMiddleware(handleDisconnectIntegrationGenerator(serviceClients), serviceClients))
	mux.HandleFunc("GET /api/integrations", authMiddleware(handleGetIntegrationsGenerator(serviceClients), serviceClients))
	httpPort := os.Getenv("GATEWAY_ADDRESS")
	server := &http.Server{
		Addr:    httpPort,
		Handler: mux,
	}

	log.Printf("Starting server on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server error: %v", err)
	}
}