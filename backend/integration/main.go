package main

import (
    "context"
    "log"
    "net"

    "google.golang.org/grpc"
    pb "github.com/cc-0000/indeq/common/api"
)

type integrationServer struct {
    pb.UnimplementedIntegrationServiceServer
}

func (s *integrationServer) Connect(ctx context.Context, req *pb.ConnectRequest) (*pb.ConnectResponse, error) {
    log.Printf("Received integration request for provider: %s, user: %s", req.Provider, req.UserId)
    return &pb.ConnectResponse{
        Success: true,
        Message: "Connected successfully to " + req.Provider,
    }, nil
}

func main() {
    listener, err := net.Listen("tcp", ":50053")
    if err != nil {
        log.Fatalf("Failed to listen: %v", err)
    }

    grpcServer := grpc.NewServer()
    pb.RegisterIntegrationServiceServer(grpcServer, &integrationServer{})

    log.Println("Integration Service is running on port 50053...")
    if err := grpcServer.Serve(listener); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
