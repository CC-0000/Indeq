package main

import (
	"context"
	"crypto/tls"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type retrievalServer struct {
	pb.UnimplementedRetrievalServiceServer
	desktopConn    *grpc.ClientConn
	desktopClient  pb.DesktopServiceClient
	vectorConn     *grpc.ClientConn
	vectorClient   pb.VectorServiceClient
	crawlingConn   *grpc.ClientConn
	crawlingClient pb.CrawlingServiceClient
}

// rpc(context, retrieve top k chunks request)
//   - retrieves the top K related chunks of text to the prompt for the given user
//   - times out after ttl miliseconds
func (s *retrievalServer) RetrieveTopKChunks(ctx context.Context, req *pb.RetrieveTopKChunksRequest) (*pb.RetrieveTopKChunksResponse, error) {
	topKMetadatas, err := s.vectorClient.GetTopKChunks(ctx, &pb.GetTopKChunksRequest{
		UserId: req.UserId,
		Prompt: req.Prompt,
		K:      req.K,
	})
	if err != nil {
		return &pb.RetrieveTopKChunksResponse{TopKChunks: []*pb.TextChunkMessage{}}, err
	}
	// TODO: create result slices for other platforms like google, etc. and retrieve them

	var topKDesktopResults []*pb.Metadata
	var topKGoogleResults []*pb.Metadata

	// Separate chunks by platform
	for _, metadata := range topKMetadatas.TopKMetadatas {
		if metadata.Platform == pb.Platform_PLATFORM_LOCAL {
			topKDesktopResults = append(topKDesktopResults, metadata)
		} else if metadata.Platform == pb.Platform_PLATFORM_GOOGLE {
			topKGoogleResults = append(topKGoogleResults, metadata)
		}
	}
	var desktopChunkResponse *pb.GetChunksFromUserResponse
	// Only try to get desktop chunks if we have results and connection is ready
	if len(topKDesktopResults) > 0 {
		if s.desktopConn == nil || s.desktopConn.GetState().String() != "READY" {
			desktopChunkResponse = &pb.GetChunksFromUserResponse{Chunks: []*pb.TextChunkMessage{}}
		} else {
			var err error
			desktopChunkResponse, err = s.desktopClient.GetChunksFromUser(ctx, &pb.GetChunksFromUserRequest{
				UserId:    req.UserId,
				Metadatas: topKDesktopResults,
				Ttl:       req.Ttl,
			})
			if err != nil {
				// Continue with empty desktop results instead of failing completely
				desktopChunkResponse = &pb.GetChunksFromUserResponse{Chunks: []*pb.TextChunkMessage{}}
			}
		}
	} else {
		desktopChunkResponse = &pb.GetChunksFromUserResponse{Chunks: []*pb.TextChunkMessage{}}
	}

	// Get Google chunks
	var googleChunkResponse *pb.GetChunksFromGoogleResponse
	if len(topKGoogleResults) > 0 {
		var err error
		googleChunkResponse, err = s.crawlingClient.GetChunksFromGoogle(ctx, &pb.GetChunksFromGoogleRequest{
			UserId:    req.UserId,
			Metadatas: topKGoogleResults,
			Ttl:       req.Ttl,
		})
		if err != nil {
			googleChunkResponse = &pb.GetChunksFromGoogleResponse{Chunks: []*pb.TextChunkMessage{}}
		}
	} else {
		googleChunkResponse = &pb.GetChunksFromGoogleResponse{Chunks: []*pb.TextChunkMessage{}}
	}

	var topKChunks []*pb.TextChunkMessage
	if desktopChunkResponse.Chunks != nil {
		topKChunks = append(topKChunks, desktopChunkResponse.Chunks...)
	}
	if googleChunkResponse.Chunks != nil {
		topKChunks = append(topKChunks, googleChunkResponse.Chunks...)
	}

	return &pb.RetrieveTopKChunksResponse{
		TopKChunks: topKChunks,
	}, nil
}

// func(client TLS config)
//   - connects to the desktop service using the provided client tls config and saves the connection and function interface to the server struct
//   - assumes: the connection will be closed in the parent function at some point
func (s *retrievalServer) connectToDesktopService(tlsConfig *tls.Config) {
	// Connect to the desktop service
	desktopAddy, ok := os.LookupEnv("DESKTOP_ADDRESS")
	if !ok {
		log.Fatal("failed to retrieve desktop address for connection")
	}
	desktopConn, err := grpc.NewClient(
		desktopAddy,
		grpc.WithTransportCredentials(credentials.NewTLS(tlsConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with desktop-service: %v", err)
	}

	s.desktopConn = desktopConn
	s.desktopClient = pb.NewDesktopServiceClient(desktopConn)
}

// func(client TLS config)
//   - connects to the vector service using the provided client tls config and saves the connection and function interface to the server struct
//   - assumes: the connection will be closed in the parent function at some point
func (s *retrievalServer) connectToVectorService(tlsConfig *tls.Config) {
	// Connect to the vector service
	vectorAddy, ok := os.LookupEnv("VECTOR_ADDRESS")
	if !ok {
		log.Fatal("failed to retrieve vector address for connection")
	}
	vectorConn, err := grpc.NewClient(
		vectorAddy,
		grpc.WithTransportCredentials(credentials.NewTLS(tlsConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with vector-service: %v", err)
	}

	s.vectorConn = vectorConn
	s.vectorClient = pb.NewVectorServiceClient(vectorConn)
}

func (s *retrievalServer) connectToCrawlingService(tlsConfig *tls.Config) {
	// Connect to the crawling service
	crawlingAddy, ok := os.LookupEnv("CRAWLING_ADDRESS")
	if !ok {
		log.Fatal("failed to retrieve crawling address for connection")
	}
	crawlingConn, err := grpc.NewClient(
		crawlingAddy,
		grpc.WithTransportCredentials(credentials.NewTLS(tlsConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with crawling-service: %v", err)
	}

	s.crawlingConn = crawlingConn
	s.crawlingClient = pb.NewCrawlingServiceClient(crawlingConn)
}

// func()
//   - sets up the gRPC server, connects it with the global struct, and TLS
//   - assumes: you will call grpcServer.GracefulStop() in the parent function at some point
func (s *retrievalServer) createGRPCServer() *grpc.Server {
	// set up TLS for the gRPC server and serve it
	tlsConfig, err := config.LoadServerTLSFromEnv("RETRIEVAL_CRT", "RETRIEVAL_KEY")
	if err != nil {
		log.Fatalf("Error loading TLS config for retrieval service: %v", err)
	}

	opts := []grpc.ServerOption{
		grpc.Creds(credentials.NewTLS(tlsConfig)),
	}
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterRetrievalServiceServer(grpcServer, s)

	return grpcServer
}

// func(pointer to a fully set up grpc server)
//   - starts the retrieval-service grpc server
//   - this is a blocking call
func (s *retrievalServer) startGRPCServer(grpcServer *grpc.Server) {
	grpcAddress, ok := os.LookupEnv("RETRIEVAL_PORT")
	if !ok {
		log.Fatal("failed to find the retrieval service port in env variables")
	}

	listener, err := net.Listen("tcp", grpcAddress)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()
	log.Printf("Retrieval gRPC Service listening on %v\n", listener.Addr())

	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}

func main() {
	// graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Load all .env variables
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// create the clientTLSConfig for use in connecting to other services
	clientTlsConfig, err := config.LoadClientTLSFromEnv("RETRIEVAL_CRT", "RETRIEVAL_KEY", "CA_CRT")
	if err != nil {
		log.Fatalf("failed to load client TLS configuration from .env: %v", err)
	}

	// create the server struct
	server := &retrievalServer{}

	// start grpc server
	grpcServer := server.createGRPCServer()
	go server.startGRPCServer(grpcServer)
	defer grpcServer.GracefulStop()

	// Connect to the desktop service
	server.connectToDesktopService(clientTlsConfig)
	defer server.desktopConn.Close()

	// Connect to the vector service
	server.connectToVectorService(clientTlsConfig)
	defer server.vectorConn.Close()

	// Connect to the crawling service
	server.connectToCrawlingService(clientTlsConfig)
	defer server.crawlingConn.Close()

	<-sigChan // TODO: implement worker groups
	log.Print("gracefully shutting down...")
}
