package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"

	pb "github.com/cc-0000/indeq/common/api"

	"github.com/cc-0000/indeq/common/config"
	"github.com/milvus-io/milvus-sdk-go/v2/client"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"

	"github.com/segmentio/kafka-go"
)

type vectorServer struct {
	pb.UnimplementedVectorServiceServer
	milvusClient *client.Client
}

func startTextChunkProcess(ctx context.Context, milvusClient *client.Client) (error error) {
	broker, ok := os.LookupEnv("KAFKA_BROKER_ADDRESS")
	if !ok {
		return fmt.Errorf("failed to retrieve kafka broker address")
	}

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{broker},
		GroupID:  "vector-readers",
		Topic:    "text-chunks",
		MaxBytes: 10e6, // maximum batch size 10MB
	})
	defer reader.Close()

	for {
		select {
		case <-ctx.Done():
			log.Print("Shutting down text chunk consumer...")
			return nil
		default:
			msg, err := reader.ReadMessage(ctx)
			if err != nil {
				log.Printf("Consumer error: %v", err)
				continue
			}

			fmt.Printf("Consumed: %s (partition %d offset %d)\n",
				string(msg.Value), msg.Partition, msg.Offset)
		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	log.Println("Starting the vector server...")

	// Load the .env file
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	grpcAddress := os.Getenv("VECTOR_PORT")

	tlsConfig, err := config.LoadTLSFromEnv("VECTOR_CRT", "VECTOR_KEY")
	if err != nil {
		log.Fatal("Error loading TLS config for vector service")
	}

	// Initialize milvus client
	milvusClient, err := client.NewClient(ctx, client.Config{
		Address: os.Getenv("ZILLIZ_ADDRESS"),
		APIKey:  os.Getenv("ZILLIZ_API_KEY"),
	})
	if err != nil {
		log.Fatal(err)
	}
	defer milvusClient.Close()

	go startTextChunkProcess(ctx, &milvusClient)

	listener, err := net.Listen("tcp", grpcAddress)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()

	log.Println("Creating the vector server")

	opts := []grpc.ServerOption{
		grpc.Creds(credentials.NewTLS(tlsConfig)),
	}
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterVectorServiceServer(grpcServer, &vectorServer{milvusClient: &milvusClient})
	log.Printf("Vector Service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	} else {
		log.Printf("Vector Service served on %v\n", listener.Addr())
	}
}
