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
	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type ServiceClients struct {
	queryClient pb.QueryServiceClient
	authClient pb.AuthenticationServiceClient
	rabbitMQConn *amqp.Connection
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

func handleGetQueryGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, _ := clients.authClient.Verify(clients.ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		// Add context cancellation
		ctx, cancel := context.WithCancel(r.Context())
		defer cancel()

		// Handle client disconnection
		go func() {
			<-ctx.Done()
			// Cleanup code here if needed
		}()
		
		// Handle SSE connection
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
			return
		}

		// Create a channel
		channel, err := clients.rabbitMQConn.Channel()
		if err != nil {
			log.Fatal(err)
		}
		defer channel.Close()

		queue, err := channel.QueueDeclare(
            verifyRes.UserId, // name
            false,           // durable
            false,           // delete when unused
            false,           // exclusive
            false,           // no-wait
            nil,            // arguments
        )
		if err != nil {
            http.Error(w, "Failed to declare queue", http.StatusInternalServerError)
            return
        }

		msgs, err := channel.Consume(
			queue.Name,
			"",    // consumer
			true,  // auto-ack
			true, // exclusive - set to true to ensure only one consumer
			false,
			false,
			nil,
		)
		if err != nil {
			http.Error(w, "Failed to register consumer", http.StatusInternalServerError)
			return
		}

		for {
			select {
			case msg, ok := <-msgs:
				if !ok {
					return
				}
				thisMsg := string(msg.Body)
				log.Printf("reading: %v", thisMsg)
				jsonData, _ := json.Marshal(struct {
					Type string `json:"type"`
					Data string `json:"data"`
				}{
					Type: "message",
					Data: thisMsg,
				})
				fmt.Fprintf(w, "data: %s\n\n", jsonData)
				flusher.Flush()
				if thisMsg == "" {
					return
				}
			case <-ctx.Done():
				return
			}
		}
	}
}

func handlePostQueryGenerator(clients *ServiceClients) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// NOTE: expects authentication middleware to have already verified the token!!!
		// Grab the token --> userId
		auth_header := r.Header.Get("Authorization")
		auth_token := strings.TrimPrefix(auth_header, "Bearer ")
		verifyRes, _ := clients.authClient.Verify(clients.ctx, &pb.VerifyRequest{
			Token: auth_token,
		})

		// Grab the query
		var queryRequest QueryRequest
		if err := json.NewDecoder(r.Body).Decode(&queryRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Send the query in a goroutine
		go func() {
			_, err := clients.queryClient.MakeQuery(clients.ctx, &pb.QueryRequest{
				UserID: verifyRes.UserId,
				Query:  queryRequest.Query,
			})
			if err != nil {
				log.Printf("Error making query: %v", err)
			}
		}()

		w.WriteHeader(http.StatusAccepted)
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

	// Save the service clients for future use
	serviceClients := &ServiceClients{
		queryClient: queryServiceClient, 
		authClient: authServiceClient,
		rabbitMQConn: rabbitMQConn,
		ctx: context.Background(),
	}
	log.Print("Server has established connection with other services")

	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello", helloHandler)
	mux.HandleFunc("POST /query", authMiddleware(handlePostQueryGenerator(serviceClients), serviceClients))
	mux.HandleFunc("GET /query", authMiddleware(handleGetQueryGenerator(serviceClients), serviceClients))
	mux.HandleFunc("POST /api/register", handleRegisterGenerator(serviceClients))
	mux.HandleFunc("POST /api/login", handleLoginGenerator(serviceClients))

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
