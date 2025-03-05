package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"strconv"
	"strings"
	"time"

	pb "github.com/cc-0000/indeq/common/api"

	"github.com/cc-0000/indeq/common/config"
	"github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/milvus-io/milvus-sdk-go/v2/entity"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/segmentio/kafka-go"
)

type vectorServer struct {
	pb.UnimplementedVectorServiceServer
	milvusClient client.Client
}

func (s *vectorServer) DeleteFile(ctx context.Context, req *pb.VectorFileDeleteRequest) (*pb.VectorFileDeleteReponse, error) {
	// UNTESTED
	// collectionName := "user_" + strings.ReplaceAll(req.UserId, "-", "_")
	collectionName := "collection_1"
	filter := fmt.Sprintf("user_id == '%s' && file_id == '%s' && platform == %d", req.UserId, req.FilePath, req.Platform)
	err := s.milvusClient.Delete(ctx, collectionName, "", filter)
	if err != nil {
		return &pb.VectorFileDeleteReponse{Success: false, Error: err.Error()}, fmt.Errorf("failed to delete data: %v", err.Error())
	}

	return nil, fmt.Errorf("")
}

func (s *vectorServer) GetTopKChunks(ctx context.Context, req *pb.GetTopKChunksRequest) (*pb.GetTopKChunksResponse, error) {
	// TODO
	return nil, fmt.Errorf("")
}

func (s *vectorServer) SetupCollection(ctx context.Context, req *pb.SetupCollectionRequest) (*pb.SetupCollectionResponse, error) {
	collectionName := req.CollectionName
	dimension, err := strconv.Atoi(os.Getenv("VECTOR_DIMENSION"))
	if err != nil {
		return &pb.SetupCollectionResponse{Success: false, Error: err.Error()}, fmt.Errorf("failed to create collection: %v", err)
	}

	idField := entity.NewField().WithName("id").WithDataType(entity.FieldTypeInt64).WithIsPrimaryKey(true).WithIsAutoID(true)
	userIdField := entity.NewField().WithName("user_id").WithDataType(entity.FieldTypeVarChar).WithTypeParams(entity.TypeParamMaxLength, "255")
	dateCreatedField := entity.NewField().WithName("date_created").WithDataType(entity.FieldTypeInt64)
	dateLastModifiedField := entity.NewField().WithName("date_modified").WithDataType(entity.FieldTypeInt64)
	fileIdField := entity.NewField().WithName("file_id").WithDataType(entity.FieldTypeVarChar).WithTypeParams(entity.TypeParamMaxLength, "255")
	pageNumberField := entity.NewField().WithName("page_number").WithDataType(entity.FieldTypeInt64)
	rowStartField := entity.NewField().WithName("row_start").WithDataType(entity.FieldTypeInt64)
	colStartField := entity.NewField().WithName("col_start").WithDataType(entity.FieldTypeInt64)
	rowEndField := entity.NewField().WithName("row_end").WithDataType(entity.FieldTypeInt64)
	colEndField := entity.NewField().WithName("col_end").WithDataType(entity.FieldTypeInt64)
	titleField := entity.NewField().WithName("title").WithDataType(entity.FieldTypeVarChar).WithTypeParams(entity.TypeParamMaxLength, "255")
	platformField := entity.NewField().WithName("platform").WithDataType(entity.FieldTypeInt8)

	vector := entity.NewField().WithName("vector").WithDataType(entity.FieldTypeFloatVector).WithDim(int64(dimension))

	schema := entity.NewSchema().WithName(collectionName).
		WithField(idField).
		WithField(userIdField).
		WithField(dateCreatedField).
		WithField(dateLastModifiedField).
		WithField(fileIdField).
		WithField(pageNumberField).
		WithField(rowStartField).
		WithField(colStartField).
		WithField(rowEndField).
		WithField(colEndField).
		WithField(titleField).
		WithField(platformField).
		WithField(vector)

	err = s.milvusClient.CreateCollection(ctx, schema, 1, client.WithConsistencyLevel(entity.ClBounded))
	if err != nil {
		log.Print(err)
		return &pb.SetupCollectionResponse{Success: false, Error: err.Error()}, fmt.Errorf("failed to create collection: %v", err)
	}

	// Create a vector index
	index, err := entity.NewIndexHNSW(entity.IP, 32, 256) // {2-100, 100-500}
	if err != nil {
		log.Print(err)
		return &pb.SetupCollectionResponse{Success: false, Error: err.Error()}, fmt.Errorf("failed to create index: %v", err)
	}
	err = s.milvusClient.CreateIndex(ctx, collectionName, "vector", index, false, client.WithIndexName("vector_index"))
	if err != nil {
		log.Print(err)
		return &pb.SetupCollectionResponse{Success: false, Error: err.Error()}, fmt.Errorf("failed to set up index in database: %v", err)
	}

	return &pb.SetupCollectionResponse{Success: true}, nil
}

func (s *vectorServer) SetupPartition(ctx context.Context, req *pb.SetupPartitionRequest) (*pb.SetupPartitionResponse, error) {

	// TODO: convert 1 collection set up to multi-collection, multi-partition, hash-based binning
	// we have 5 collections on the zilliz free tier
	// each collection can have 64 partitions
	// partitionName := "user_" + strings.ReplaceAll(req.UserId, "-", "_") <-- example

	// TEMPORARY
	collectionName := "collection_1"
	ok, err := s.milvusClient.HasCollection(ctx, collectionName)
	if err != nil {
		return &pb.SetupPartitionResponse{
			Success: false,
			Error:   err.Error(),
		}, err
	}
	if !ok {
		res, err := s.SetupCollection(ctx, &pb.SetupCollectionRequest{
			CollectionName: collectionName,
		})
		if !res.Success || err != nil {
			return &pb.SetupPartitionResponse{
				Success: false,
				Error:   err.Error(),
			}, nil
		}
	}
	return &pb.SetupPartitionResponse{
		Success: true,
	}, nil
}

// TEMPORARY
func (s *vectorServer) findCollectionForPartition(ctx context.Context, partitionName string) (string, error) {
	for i := range 5 {
		collectionName := "collection_" + strconv.Itoa(i)
		exists, err := s.milvusClient.HasCollection(ctx, collectionName)
		if err != nil {
			return "", err
		}
		if exists {
			// collection exists check for the partition
			exists, err = s.milvusClient.HasPartition(ctx, collectionName, partitionName)
			if err != nil {
				return "", err
			}
			if exists {
				return collectionName, nil
			}
		}
	}
	return "", fmt.Errorf("there are no collections with the partition name: %v", partitionName)
}

func insertRow(ctx context.Context, milvusClient client.Client, textChunkMessage *pb.TextChunkMessage, embedding []float32) error {
	collectionName := "user_" + strings.ReplaceAll(textChunkMessage.Metadata.UserId, "-", "_")
	dimension, err := strconv.Atoi(os.Getenv("VECTOR_DIMENSION"))
	if err != nil {
		return err
	}

	if textChunkMessage.Metadata.DateCreated == nil {
		textChunkMessage.Metadata.DateCreated = timestamppb.New(time.Unix(0, 0))
	}
	if textChunkMessage.Metadata.DateLastModified == nil {
		textChunkMessage.Metadata.DateLastModified = timestamppb.New(time.Unix(0, 0))
	}

	resInsert, err := milvusClient.Insert(ctx,
		collectionName,
		"",
		entity.NewColumnInt64("date_created", []int64{textChunkMessage.Metadata.DateCreated.Seconds}),
		entity.NewColumnInt64("date_modified", []int64{textChunkMessage.Metadata.DateLastModified.Seconds}),
		entity.NewColumnVarChar("file_id", []string{textChunkMessage.Metadata.FileId}),
		entity.NewColumnInt64("page_number", []int64{int64(textChunkMessage.Metadata.Page)}),
		entity.NewColumnInt64("row_start", []int64{int64(textChunkMessage.Metadata.RowStart)}),
		entity.NewColumnInt64("col_start", []int64{int64(textChunkMessage.Metadata.ColStart)}),
		entity.NewColumnInt64("row_end", []int64{int64(textChunkMessage.Metadata.RowEnd)}),
		entity.NewColumnInt64("col_end", []int64{int64(textChunkMessage.Metadata.ColEnd)}),
		entity.NewColumnVarChar("title", []string{textChunkMessage.Metadata.Title}),
		entity.NewColumnInt8("platform", []int8{int8(textChunkMessage.Metadata.Platform)}),
		entity.NewColumnFloatVector("vector", dimension, [][]float32{embedding}),
	)
	if err != nil {
		return err
	}
	log.Println(resInsert.Name(), resInsert.Len())
	return nil
}

func startTextChunkProcess(ctx context.Context, milvusClient client.Client) (error error) {
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
			// Read message from stream
			msg, err := reader.ReadMessage(ctx)
			if err != nil {
				log.Printf("Consumer error: %v", err)
				continue
			}

			// Parse message out
			var textChunk pb.TextChunkMessage
			proto.Unmarshal(msg.Value, &textChunk)

			// Vectorize it by sending it to an embedding model
			embedding, err := GetEmbedding(ctx, textChunk.Content)
			if err != nil {
				log.Print(err)
				continue
			}

			// Store the vector in our vector database
			err = insertRow(ctx, milvusClient, &textChunk, embedding)
			if err != nil {
				log.Print(err)
				continue
			}
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

	tlsConfig, err := config.LoadServerTLSFromEnv("VECTOR_CRT", "VECTOR_KEY")
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

	go startTextChunkProcess(ctx, milvusClient)

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
	pb.RegisterVectorServiceServer(grpcServer, &vectorServer{milvusClient: milvusClient})
	log.Printf("Vector Service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	} else {
		log.Printf("Vector Service served on %v\n", listener.Addr())
	}
}
