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
	waitlistClient pb.WaitlistServiceClient
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

	// Save the service clients for future use
	serviceClients := &ServiceClients{
		queryClient:  queryServiceClient,
		authClient:   authServiceClient,
		waitlistClient: waitlistServiceClient,
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
	mux.HandleFunc("POST /api/waitlist", handleAddToWaitlist(serviceClients))

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
