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

func (s *queryServer) MakeQuery(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
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

	grpcAddress := os.Getenv("GRPC_ADDRESS")

	listener, err := net.Listen("tcp", grpcAddress)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()

	log.Println("Creating the query server...")

	grpcServer := grpc.NewServer()
	pb.RegisterQueryServiceServer(grpcServer, &queryServer{})
	log.Printf("Query service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatal(err.Error())
	} else {
		log.Printf("Query service served on %v\n", listener.Addr())
	}

}