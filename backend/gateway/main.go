package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type HelloResponse struct {
	Message string `json:"message"`
}

type QueryRequest struct {
	UserID	string	`json:"userId"`
	Query	string	`json:"query"`
}

type ServiceClients struct {
	queryClient pb.QueryServiceClient
	ctx context.Context
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(HelloResponse{Message: "Hello, World!"})
}

func handleMakeQueryGenerator(clients *ServiceClients) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
		var queryRequest QueryRequest
		log.Printf("Received request \n")
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

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

    conn, err := grpc.NewClient(
        os.Getenv("GRPC_ADDRESS"), // Target address
        grpc.WithTransportCredentials(insecure.NewCredentials()), // Required for plaintext
    )
	if err != nil {
		log.Fatalf("Failed to establish connection: %v", err)
	}
	defer conn.Close()
	queryServiceClient := pb.NewQueryServiceClient(conn)
	serviceClients := &ServiceClients{
		queryClient: queryServiceClient, 
		ctx: context.Background(),
	}
	log.Print("Server has established connection with query")

	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello", helloHandler)
	mux.HandleFunc("GET /query", handleMakeQueryGenerator(serviceClients))

	httpPort := os.Getenv("HTTP_PORT")
	server := &http.Server{
		Addr:    httpPort,
		Handler: mux,
	}

	log.Printf("Starting server on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server error: %v", err)
	}
}
