package main

import (
	"context"
	"log"
	"net"
	"os"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
)

type queryServer struct {
	pb.UnimplementedQueryServiceServer 
}

func (h *queryServer) MakeQuery(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	res := req.Query + "\n I have received your query!"
	return &pb.QueryResponse{
		UserID: req.UserID, 
		Response: res,
		}, nil
}


func main() {
	log.Println("Starting the server...")
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	listener, err := net.Listen("tcp", os.Getenv("GRPC_ADDRESS"))
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()

	log.Println("Creating the server...")

	grpcServer := grpc.NewServer()
	pb.RegisterQueryServiceServer(grpcServer, &queryServer{})
	log.Printf("Query service running on %v\n", os.Getenv("GRPC_ADDRESS"))
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatal(err.Error())
	}

}