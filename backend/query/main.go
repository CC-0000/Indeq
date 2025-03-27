package main

import (
	"bufio"
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"syscall"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type queryServer struct {
	pb.UnimplementedQueryServiceServer
	rabbitMQConn     *amqp.Connection
	retrievalConn    *grpc.ClientConn
	retrievalService pb.RetrievalServiceClient
	queueTTL         int
}

type OllamaRequest struct {
	Model   string         `json:"model"`
	Prompt  string         `json:"prompt"`
	Stream  bool           `json:"stream"`
	Options map[string]any `json:"options"`
}

type QueueTokenMessage struct {
	Type  string `json:"type"`
	Token string `json:"token"`
}

type QueueSourceMessage struct {
	Type          string `json:"type"`
	ExcerptNumber int    `json:"excerpt_number"`
	Title         string `json:"title"`
	Extension     string `json:"extension"`
	FilePath      string `json:"file_path"`
}

// rpc(context, query request)
//   - takes in a query for a given user
//   - fetches the top k chunks relevant to the query and passes that context to the llm
//   - streams the response back to a rabbitMQ queue {conversation_id}
//   - assumes: you have set the variable s.queueTTL
func (s *queryServer) MakeQuery(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	// get the number of sources and ttl from env
	kVal, err := strconv.ParseInt(os.Getenv("QUERY_NUMBER_OF_SOURCES"), 10, 32)
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to retrieve the number_of_sources env variable: %w", err)
	}
	ttlVal, err := strconv.ParseUint(os.Getenv("QUERY_TTL"), 10, 32)
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to retrieve the ttl env variable: %w", err)
	}

	// TODO: implement function calling for better filtering (dates, titles, etc.)
	// fetch context associated with the query
	topKChunksResponse, err := s.retrievalService.RetrieveTopKChunks(ctx, &pb.RetrieveTopKChunksRequest{
		UserId: req.UserId,
		Prompt: req.Query,
		K:      int32(kVal),
		Ttl:    uint32(ttlVal),
	})
	if err != nil {
		// TODO: don't error out and instead let the llm know that you were unable to find information
		return &pb.QueryResponse{}, fmt.Errorf("failed to get top k chunks: %w", err)
	}

	// Group chunks by file path
	chunksByFilePath := make(map[string][]*pb.TextChunkMessage)
	for _, chunk := range topKChunksResponse.TopKChunks {
		filePath := chunk.Metadata.FilePath
		chunksByFilePath[filePath] = append(chunksByFilePath[filePath], chunk)
	}

	for filePath, chunks := range chunksByFilePath {
		sort.Slice(chunks, func(i, j int) bool {
			return chunks[i].Metadata.Start < chunks[j].Metadata.Start
		})
		chunksByFilePath[filePath] = chunks
	}

	// assemble the full prompt from the chunks and the query
	var fullprompt string = "Below are relevant excerpts from user documents. Use this information to answer the question that follows. If the information provided is not sufficient, use your general knowledge but prioritize the given context. Always cite sources when using specific information from the excerpts.\n\n"

	excerptNumber := 1
	for _, chunks := range chunksByFilePath {
		fullprompt += fmt.Sprintf("Excerpt %d:\n", excerptNumber)
		fullprompt += fmt.Sprintf("Title: %s\n", chunks[0].Metadata.Title)
		fullprompt += fmt.Sprintf("Folder: %s\n", filepath.Dir(chunks[0].Metadata.FilePath))
		fullprompt += fmt.Sprintf("Date Modified: %s\n\n", chunks[0].Metadata.DateLastModified.AsTime().Format("2006-01-02 15:04:05"))

		for _, chunk := range chunks {
			content := chunk.Content
			fullprompt += fmt.Sprintf("Content: %s\n\n", content)
		}
		excerptNumber++
	}

	fullprompt += "Question: " + req.Query + "\n\n"
	fullprompt += "Instructions: Provide a comprehensive answer to the question above, using the given excerpts as your primary source of information. Cite sources using the title of the document. If the excerpts don't contain relevant information, state this and provide an answer based on your general knowledge."

	// use the following to debug quality and size of context retrieved:
	// log.Print("the number of characters in the full prompt is: ", len(fullprompt))
	// log.Print(fullprompt)

	// TODO: send the request to an API endpoint like google for faster responses vs. self-hosting
	// send req to llm
	llmRequestBody := OllamaRequest{
		Model:  os.Getenv("LLM_MODEL"),
		Prompt: fullprompt,
		Stream: true,
		Options: map[string]any{
			"num_ctx":    131072,
			"num_thread": 4,
		},
	}
	llmRequestJSON, err := json.Marshal(llmRequestBody)
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to marshal request: %w", err)
	}
	llmReq, _ := http.NewRequestWithContext(ctx, "POST", os.Getenv("OLLAMA_URL"), bytes.NewReader(llmRequestJSON))
	llmReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	llmRes, err := client.Do(llmReq)
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to make query to llm: %w", err)
	}
	defer llmRes.Body.Close()
	scanner := bufio.NewScanner(llmRes.Body)

	// Create a rabbitmq channel to stream the response
	channel, err := s.rabbitMQConn.Channel()
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to create rabbitmq channel: %w", err)
	}
	defer channel.Close()

	// Create notification channels for when the client closes the channel --> cancel the context
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	notifyClose := channel.NotifyClose(make(chan *amqp.Error, 1))
	notifyCancel := channel.NotifyCancel(make(chan string, 1))
	go func(cancel context.CancelFunc) {
		select {
		case <-notifyClose:
			cancel()
		case <-notifyCancel:
			cancel()
		case <-ctx.Done():
			return
		}
	}(cancel)

	// create a rabbitmq queue to stream tokens to
	queue, err := channel.QueueDeclare(
		req.ConversationId, // queue name
		false,              // durable
		true,               // delete when unused
		false,              // exclusive
		false,              // no-wait
		amqp.Table{ // arguments
			"x-expires": s.queueTTL,
		},
	)
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to create queue: %w", err)
	}

	// send the sources first
	excerptNumber = 1
	for _, chunks := range chunksByFilePath {
		// create a QueueSourceMessage for each file group
		if len(chunks) == 0 {
			continue
		}
		queueSourceMessage := QueueSourceMessage{
			Type:          "source",
			ExcerptNumber: excerptNumber,
			Title:         chunks[0].Metadata.Title[:len(chunks[0].Metadata.Title)-len(filepath.Ext(chunks[0].Metadata.FilePath))],
			Extension:     strings.TrimPrefix(filepath.Ext(chunks[0].Metadata.FilePath), "."),
			FilePath:      chunks[0].Metadata.FilePath,
		}
		byteMessage, err := json.Marshal(queueSourceMessage)
		if err != nil {
			return &pb.QueryResponse{}, fmt.Errorf("failed to marshal source message: %w", err)
		}

		err = channel.PublishWithContext(
			ctx,
			"",         // exchange
			queue.Name, // routing key
			false,      // mandatory
			false,      // immediate
			amqp.Publishing{
				ContentType: "application/json",
				Body:        byteMessage,
			},
		)
		if err != nil {
			return &pb.QueryResponse{}, fmt.Errorf("failed to publish message: %w", err)
		}
		excerptNumber++
	}

	// Keeps on reading until there are no more tokens
	for scanner.Scan() {
		select {
		case <-ctx.Done():
			return &pb.QueryResponse{}, fmt.Errorf("early abort due to context cancellation")
		default:
			// check if the queue still exists
			_, err := channel.QueueDeclarePassive(
				req.ConversationId, // queue name
				false,              // durable
				true,               // delete when unused
				false,              // exclusive
				false,              // no-wait
				amqp.Table{ // arguments
					"x-expires": s.queueTTL, // 5 minutes in milliseconds
				},
			)
			if err != nil {
				break // stop processing
			}

			// parse the token
			var result map[string]any
			json.Unmarshal(scanner.Bytes(), &result)
			if _, exists := result["response"]; !exists {
				log.Printf("Response doesn't contain 'response' field: %v", result)
				continue
			}
			token, ok := result["response"].(string)
			if !ok {
				log.Printf("Error: response field is not a string")
				continue
			}

			// create our token type
			queueTokenMessage := QueueTokenMessage{
				Type:  "token",
				Token: token,
			}
			if token == "" {
				queueTokenMessage.Type = "end"
			}
			byteMessage, err := json.Marshal(queueTokenMessage)
			if err != nil {
				log.Printf("Error marshalling token message: %v", err)
				continue
			}

			// send the token to rabbitmq
			err = channel.PublishWithContext(
				ctx,
				"",         // exchange
				queue.Name, // routing key
				false,      // mandatory
				false,      // immediate
				amqp.Publishing{
					ContentType: "application/json",
					Body:        byteMessage,
				})
			if err != nil {
				log.Printf("Error publishing message: %v", err)
				continue
			}
		}
	}

	return &pb.QueryResponse{}, nil
}

// func(client TLS config)
//   - connects to the retrieval service using the provided client tls config and saves the connection and function interface to the server struct
//   - assumes: the connection will be closed in the parent function at some point
func (s *queryServer) connectToRetrievalService(tlsConfig *tls.Config) {
	// Connect to the desktop service
	retrievalAddy, ok := os.LookupEnv("RETRIEVAL_ADDRESS")
	if !ok {
		log.Fatal("failed to retrieve retrieval address for connection")
	}
	retrievalConn, err := grpc.NewClient(
		retrievalAddy,
		grpc.WithTransportCredentials(credentials.NewTLS(tlsConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to establish connection with retrieval-service: %v", err)
	}

	s.retrievalConn = retrievalConn
	s.retrievalService = pb.NewRetrievalServiceClient(retrievalConn)
}

// func()
//   - sets up the gRPC server, connects it with the global struct, and TLS
//   - assumes: you will call grpcServer.GracefulStop() in the parent function at some point
func (s *queryServer) createGRPCServer() *grpc.Server {
	// set up TLS for the gRPC server and serve it
	tlsConfig, err := config.LoadServerTLSFromEnv("QUERY_CRT", "QUERY_KEY")
	if err != nil {
		log.Fatalf("Error loading TLS config for query service: %v", err)
	}

	opts := []grpc.ServerOption{
		grpc.Creds(credentials.NewTLS(tlsConfig)),
	}
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterQueryServiceServer(grpcServer, s)

	return grpcServer
}

// func(pointer to a fully set up grpc server)
//   - starts the query-service grpc server
//   - this is a blocking call
func (s *queryServer) startGRPCServer(grpcServer *grpc.Server) {
	grpcAddress, ok := os.LookupEnv("QUERY_PORT")
	if !ok {
		log.Fatal("failed to find the query service port in env variables")
	}

	listener, err := net.Listen("tcp", grpcAddress)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()
	log.Printf("Query gRPC Service listening on %v\n", listener.Addr())

	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}

// func()
//   - connects to the rabbitMQ broker
//   - assumes: you will call rabbitMQConn.Close() in the parent function at some point
func (s *queryServer) connectToRabbitMQ() {
	// Connect to RabbitMQ
	rabbitMQConn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Fatalf("failed to connect to RabbitMQ broker: %v", err)
	}
	s.rabbitMQConn = rabbitMQConn

	queue_ttl, err := strconv.ParseUint(os.Getenv("QUERY_QUEUE_TTL"), 10, 32)
	if err != nil {
		log.Fatal("failed to find the query queue ttl in env variables")
	}
	s.queueTTL = int(queue_ttl)
}

func main() {
	// graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Load the .env file
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// create the clientTLSConfig for use in connecting to other services
	clientTlsConfig, err := config.LoadClientTLSFromEnv("QUERY_CRT", "QUERY_KEY", "CA_CRT")
	if err != nil {
		log.Fatalf("failed to load client TLS configuration from .env: %v", err)
	}

	// create the server struct
	server := &queryServer{}

	// Connect to RabbitMQ
	server.connectToRabbitMQ()
	defer server.rabbitMQConn.Close()

	// start grpc server
	grpcServer := server.createGRPCServer()
	go server.startGRPCServer(grpcServer)
	defer grpcServer.GracefulStop()

	// Connect to retrieval service
	server.connectToRetrievalService(clientTlsConfig)
	defer server.retrievalConn.Close()

	// listen for shutdown signal
	<-sigChan // TODO: implement worker groups
	log.Print("gracefully shutting down...")
}
