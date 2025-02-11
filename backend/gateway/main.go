package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	pb "github.com/cc-0000/indeq/common/api"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type ServiceClients struct {
	queryClient pb.QueryServiceClient
	authClient pb.AuthenticationServiceClient
	integrationClient pb.IntegrationServiceClient
	ctx context.Context
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

		res, err := clients.authClient.Verify(clients.ctx, &pb.VerifyRequest{
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

func handleMakeQueryGenerator(clients *ServiceClients) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
		var queryRequest QueryRequest
		if err := json.NewDecoder(r.Body).Decode(&queryRequest); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// Call the service
		res, err := clients.queryClient.MakeQuery(clients.ctx, &pb.QueryRequest{
			UserID: queryRequest.UserID,
			Query: queryRequest.Query,
		})
		if err != nil {
			http.Error(w, "Failed to make query", http.StatusInternalServerError)
            return
		}

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(res)
	}
}

func handleConnectIntegrationGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
		res, err := clients.authClient.Register(clients.ctx, &pb.RegisterRequest{
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
		res, err := clients.authClient.Login(clients.ctx, &pb.LoginRequest{
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
		ctx: context.Background(),
	}
	log.Print("Server has established connection with other services")

	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello", helloHandler)
	mux.HandleFunc("POST /query", authMiddleware(handleMakeQueryGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/register", handleRegisterGenerator(serviceClients))
	mux.HandleFunc("POST /api/login", handleLoginGenerator(serviceClients))
	mux.HandleFunc("POST /api/connect", authMiddleware(handleConnectIntegrationGenerator(serviceClients), serviceClients))

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