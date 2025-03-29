package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"sort"
	"strconv"
	"syscall"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type retrievalServer struct {
	pb.UnimplementedRetrievalServiceServer
	desktopConn     *grpc.ClientConn
	desktopClient   pb.DesktopServiceClient
	vectorConn      *grpc.ClientConn
	vectorClient    pb.VectorServiceClient
	embeddingConn   *grpc.ClientConn
	embeddingClient pb.EmbeddingServiceClient
}

// rpc(context, retrieve top k chunks request)
//   - retrieves the top K related chunks of text to the prompt for the given user
//   - times out after ttl miliseconds
func (s *retrievalServer) RetrieveTopKChunks(ctx context.Context, req *pb.RetrieveTopKChunksRequest) (*pb.RetrieveTopKChunksResponse, error) {
	numberOfSources := req.K
	kVal, err := strconv.Atoi(os.Getenv("RETRIEVAL_K_VAL"))
	if err != nil {
		return &pb.RetrieveTopKChunksResponse{TopKChunks: []*pb.TextChunkMessage{}}, fmt.Errorf("failed to retrieve the k value from the env variables: %w", err)
	}

	topKMetadatas, err := s.vectorClient.GetTopKChunks(ctx, &pb.GetTopKChunksRequest{
		UserId: req.UserId,
		Prompt: req.ExpandedPrompt,
		K:      int32(kVal),
	})
	if err != nil {
		return &pb.RetrieveTopKChunksResponse{TopKChunks: []*pb.TextChunkMessage{}}, err
	}

	// TODO: create result slices for other platforms like google, etc. and retrieve them

	var topKDesktopResults []*pb.Metadata
	for _, metadata := range topKMetadatas.TopKMetadatas {
		if metadata.Platform == pb.Platform_PLATFORM_LOCAL {
			topKDesktopResults = append(topKDesktopResults, metadata)
		} else if metadata.Platform == pb.Platform_PLATFORM_GOOGLE_DRIVE {
			// TODO: fill out result slices for other platforms
		}
	}

	// fetch the file contents for desktop
	desktopChunkResponse, err := s.desktopClient.GetChunksFromUser(ctx, &pb.GetChunksFromUserRequest{
		UserId:    req.UserId,
		Metadatas: topKDesktopResults,
		Ttl:       req.Ttl,
	})
	if err != nil {
		return &pb.RetrieveTopKChunksResponse{
			TopKChunks: []*pb.TextChunkMessage{},
		}, err
	}

	// TODO: fetch chunks from other platforms

	// TODO: coalesce chunks from multiple sources to make a response
	var topKChunks []*pb.TextChunkMessage
	if desktopChunkResponse.Chunks != nil {
		topKChunks = append(topKChunks, desktopChunkResponse.Chunks...)
	}

	// rerank the results by first getting the scores
	scores, err := s.embeddingClient.RerankPassages(ctx, &pb.RerankingRequest{
		Query: req.Prompt,
		Passages: func() []string {
			var passages []string
			for _, chunk := range topKChunks {
				passages = append(passages, chunk.Content)
			}
			return passages
		}(),
	})
	if err != nil {
		return &pb.RetrieveTopKChunksResponse{
			TopKChunks: []*pb.TextChunkMessage{},
		}, err
	}

	type passageScore struct {
		score float32
		chunk *pb.TextChunkMessage
	}
	var passageScores []passageScore
	for i, chunk := range topKChunks {
		passageScores = append(passageScores, passageScore{
			chunk: chunk,
			score: scores.Scores[i],
		})
	}

	// order the chunks by their scores
	sort.Slice(passageScores, func(i, j int) bool {
		return passageScores[i].score > passageScores[j].score
	})

	// collect only the first numberOfSources chunks
	var topNumberOfSourcesChunks []*pb.TextChunkMessage
	for i := range min(numberOfSources, int32(len(passageScores))) {
		topNumberOfSourcesChunks = append(topNumberOfSourcesChunks, passageScores[i].chunk)
	}

	return &pb.RetrieveTopKChunksResponse{
		TopKChunks: topNumberOfSourcesChunks,
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

// func(client TLS config)
//   - connects to the embedding service using the provided client tls config and saves the connection and function interface to the server struct
//   - assumes: the connection will be closed in the parent function at some point
func (s *retrievalServer) connectToEmbeddingService(tlsConfig *tls.Config) {
	// connect to the embedding service
	embeddingAddy, ok := os.LookupEnv("EMBEDDING_ADDRESS")
	if !ok {
		log.Fatal("failed to retrieve desktop address for connection")
	}
	embeddingConn, err := grpc.NewClient(
		embeddingAddy,
		grpc.WithTransportCredentials(credentials.NewTLS(tlsConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with embedding-service: %v", err)
	}

	s.embeddingConn = embeddingConn
	s.embeddingClient = pb.NewEmbeddingServiceClient(embeddingConn)
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

	// Connect to the embedding service
	server.connectToEmbeddingService(clientTlsConfig)
	defer server.embeddingConn.Close()

	<-sigChan // TODO: implement worker groups
	log.Print("gracefully shutting down...")
}
