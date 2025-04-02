package main

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net"

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

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"

	kivik "github.com/go-kivik/kivik/v4"
	_ "github.com/go-kivik/kivik/v4/couchdb"
)

type queryServer struct {
	pb.UnimplementedQueryServiceServer
	rabbitMQConn                   *amqp.Connection
	retrievalConn                  *grpc.ClientConn
	retrievalService               pb.RetrievalServiceClient
	queueTTL                       int
	geminiClient                   *genai.Client
	geminiFlash2ModelHeavy         *genai.GenerativeModel
	geminiFlash2ModelLight         *genai.GenerativeModel
	geminiFlash2ModelSummarization *genai.GenerativeModel
	couchdbClient                  *kivik.Client
	conversationsDB                *kivik.DB
}

// func(context, rabbitmq channel, queue to send message to, byte encoded message of some json)
//   - sends the byte message to the given queue name
//   - assumes: the rabbitmq channel is open and the byte encoded message is from json
func (s *queryServer) sendToQueue(ctx context.Context, channel *amqp.Channel, queueName string, byteMessage []byte) error {
	err := channel.PublishWithContext(
		ctx,
		"",        // exchange
		queueName, // routing key
		false,     // mandatory
		false,     // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        byteMessage,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}
	return nil
}

// func(context, query to expand, conversation id)
//   - takes in a query and returns the expanded query that ideally contains better keywords for search
//   - can be set to return the original query if the env variable QUERY_EXPANSION is set to false
func (s *queryServer) expandQuery(ctx context.Context, query string, conversationID string) (string, error) {
	if os.Getenv("QUERY_EXPANSION") == "false" {
		return query, nil
	}

	fullprompt := "User Query: {" + query + "}\n\n" +
		"Search Terms:"

	// feed the old conversation to the model
	conversation, err := s.getConversation(ctx, conversationID)
	if err != nil {
		return query, fmt.Errorf("failed to get conversation: %w", err)
	}
	session := s.geminiFlash2ModelLight.StartChat()
	session.History = s.convertConversationToChatHistory(conversation)

	// send the new message
	resp, err := session.SendMessage(ctx, genai.Text(fullprompt))
	if err != nil {
		return query, fmt.Errorf("failed to send message to google gemini: %w", err)
	}
	var messageText string
	if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
		if textPart, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
			messageText = string(textPart)
		}
	}

	return messageText, nil
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
	// TODO: implement query conversion for better searching

	expandedQuery, err := s.expandQuery(ctx, req.Query, req.ConversationId)
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to expand query: %w", err)
	}
	log.Print("got the expanded query: ", expandedQuery)

	// fetch context associated with the query
	topKChunksResponse, err := s.retrievalService.RetrieveTopKChunks(ctx, &pb.RetrieveTopKChunksRequest{
		UserId:         req.UserId,
		Prompt:         req.Query,
		ExpandedPrompt: expandedQuery,
		K:              int32(kVal),
		Ttl:            uint32(ttlVal),
	})
	if err != nil {
		// TODO: don't error out and instead let the llm know that you were unable to find information
		topKChunksResponse = &pb.RetrieveTopKChunksResponse{
			TopKChunks: []*pb.TextChunkMessage{},
		}
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
	var fullprompt string = ""

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
	fullprompt += "Instructions: Provide a comprehensive answer to the question above, using the given excerpts plus the conversation history if necessary, but falling back to your expert general knowledge if the excerpts are insufficient. Cite sources using the <Excerpt number> (with angle brackets!) of the document."

	// TODO: add the option to use more than 1 model

	// start a gemini session and pull in the chat history
	conversation, err := s.getConversation(ctx, req.ConversationId)
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to get conversation: %w", err)
	}
	session := s.geminiFlash2ModelHeavy.StartChat()
	session.History = s.convertConversationToChatHistory(conversation)

	// send the message to the llm
	iter := session.SendMessageStream(ctx, genai.Text(fullprompt))
	var llmResponse string
	var sources []*pb.QuerySourceMessage

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
		req.RequestId, // queue name
		false,         // durable
		true,          // delete when unused
		false,         // exclusive
		false,         // no-wait
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
		queueSourceMessage := &pb.QuerySourceMessage{
			Type:          "source",
			ExcerptNumber: int32(excerptNumber),
			Title:         chunks[0].Metadata.Title[:len(chunks[0].Metadata.Title)-len(filepath.Ext(chunks[0].Metadata.FilePath))],
			Extension:     strings.TrimPrefix(filepath.Ext(chunks[0].Metadata.FilePath), "."),
			FilePath:      chunks[0].Metadata.FilePath,
		}
		byteMessage, err := json.Marshal(queueSourceMessage)
		if err != nil {
			return &pb.QueryResponse{}, fmt.Errorf("failed to marshal source message: %w", err)
		}

		if err = s.sendToQueue(ctx, channel, queue.Name, byteMessage); err != nil {
			return &pb.QueryResponse{}, fmt.Errorf("failed to publish message: %w", err)
		}
		sources = append(sources, queueSourceMessage)
		excerptNumber++
	}

	// send the tokens
	for {
		resp, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return &pb.QueryResponse{}, fmt.Errorf("error streaming response from gemini: %w", err)
		}

		// Print each chunk as it arrives
		for _, candidate := range resp.Candidates {
			for _, part := range candidate.Content.Parts {
				select {
				case <-ctx.Done():
					return &pb.QueryResponse{}, fmt.Errorf("early abort due to context cancellation")
				default:
					// check if the queue still exists
					_, err := channel.QueueDeclarePassive(
						req.RequestId, // queue name
						false,         // durable
						true,          // delete when unused
						false,         // exclusive
						false,         // no-wait
						amqp.Table{ // arguments
							"x-expires": s.queueTTL, // 5 minutes in milliseconds
						},
					)
					if err != nil {
						break // stop processing
					}

					// create our token type
					queueTokenMessage := &pb.QueryTokenMessage{
						Type:  "token",
						Token: fmt.Sprintf("%v", part),
					}
					byteMessage, err := json.Marshal(queueTokenMessage)
					if err != nil {
						log.Printf("Error marshalling token message: %v", err)
						continue
					}

					err = s.sendToQueue(ctx, channel, queue.Name, byteMessage)
					if err != nil {
						log.Printf("Error publishing message: %v", err)
						continue
					}
					llmResponse += fmt.Sprintf("%v", part)
				}
			}
		}
	}

	// store the new user query
	if err := s.appendToConversation(ctx, req.ConversationId, &pb.QueryMessage{
		Text:   req.Query,
		Sender: "user",
	}); err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to update conversation in database: %w", err)
	}

	// store the llm response
	if err := s.appendToConversation(ctx, req.ConversationId, &pb.QueryMessage{
		Text:      llmResponse,
		Sender:    "model",
		Sources:   sources,
		Reasoning: []string{}, // TODO: implement reasoning for reasoning models
	}); err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("failed to update conversation in database: %w", err)
	}

	// send the end token
	endMessage := &pb.QueryTokenMessage{
		Type:  "end",
		Token: "",
	}
	byteMessage, err := json.Marshal(endMessage)
	if err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("error marshalling token message: %w", err)
	}
	if err = s.sendToQueue(ctx, channel, queue.Name, byteMessage); err != nil {
		return &pb.QueryResponse{}, fmt.Errorf("error publishing message: %w", err)
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

// func(context)
//   - connects to google gemini
//   - assumes: the client will be closed in the parent function at some point
func (s *queryServer) connectToGoogleGemini() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	geminiApikey, ok := os.LookupEnv("GEMINI_API_KEY")
	if !ok {
		log.Fatalf("failed to retrieve the gemini api key")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(geminiApikey))
	if err != nil {
		log.Fatalf("Error creating client: %v", err)
	}
	s.geminiClient = client

	heavyModel := client.GenerativeModel("gemini-2.0-flash-lite")
	heavyModel.SetTemperature(1)
	heavyModel.SetTopK(1)
	heavyModel.SetTopP(0.95)
	heavyModel.SetMaxOutputTokens(8196)
	heavyModel.ResponseMIMEType = "text/plain"
	systemPrompt := "You are a very helpful assistant called Indeq with knowledge on virtually every single topic. You will ALWAYS find the best answer to the user's query, even if you're missing information from excerpts. Use the conversation history, and any provided excerpts to augment your general knowledge and then answer the question that follows. Always cite sources using the <number_of_excerpt_in_question> (with angle brackets!) when using specific information from the excerpts.\n\n"
	heavyModel.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(systemPrompt),
		},
	}
	s.geminiFlash2ModelHeavy = heavyModel

	lightModel := client.GenerativeModel("gemini-2.0-flash-lite")
	lightModel.SetTemperature(1)
	lightModel.SetTopK(1)
	lightModel.SetTopP(0.95)
	lightModel.SetMaxOutputTokens(200)
	lightModel.ResponseMIMEType = "text/plain"
	systemPrompt = "IMPORTANT: Do NOT answer the query directly. Your task is ONLY to expand and rephrase the query into search terms.\n\n" +
		"Instructions:\n" +
		"1. Analyze the user query\n" +
		"2. Generate 3-5 alternative phrasings, related concepts, and key terms that would be useful for searching documents\n" +
		"3. Format your response ONLY as a list of search terms and phrases\n" +
		"4. Do NOT provide explanations or direct answers to the query\n\n"

	lightModel.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(systemPrompt),
		},
	}
	s.geminiFlash2ModelLight = lightModel

	summarizationModel := client.GenerativeModel("gemini-2.0-flash-lite")
	summarizationModel.SetTemperature(0.3)
	summarizationModel.SetTopK(1)
	summarizationModel.SetTopP(0.95)
	summarizationModel.SetMaxOutputTokens(1024)
	summarizationModel.ResponseMIMEType = "text/plain"
	systemPrompt = "Your task is to create a concise summary of the following conversation between a human and an AI assistant. Focus on capturing the key points, questions, and information exchanged.\n\n" +
		"Instructions:\n" +
		"1. Extract the main topics, questions, and information from the conversation\n" +
		"2. Identify any decisions made or conclusions reached\n" +
		"3. Maintain factual accuracy while condensing the exchange\n" +
		"4. Summarize in third person (e.g., 'The human asked about X, and the AI explained Y')\n" +
		"5. Be brief but comprehensive, highlighting the most important information\n" +
		"6. Exclude pleasantries, acknowledgments, and other non-essential dialogue\n\n" +
		"The summary should be significantly shorter than the original conversation while preserving the essential context needed for understanding the interaction.\n\n"

	summarizationModel.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(systemPrompt),
		},
	}
	s.geminiFlash2ModelSummarization = summarizationModel
}

// func()
//   - connects to the couchdb database
//   - assumes: you will call couchdbClient.Close() in the parent function at some point
//   - assumes: you will call conversationsDB.Close() in the parent function at some point
func (s *queryServer) connectToCouchDB(ctx context.Context) {
	// retrieve env credentials
	couchdbUser, ok := os.LookupEnv("COUCHDB_USER")
	if !ok {
		log.Fatalf("failed to retrieve the couchdb user")
	}
	couchdbPassword, ok := os.LookupEnv("COUCHDB_PASSWORD")
	if !ok {
		log.Fatalf("failed to retrieve the couchdb password")
	}
	couchdbAddress, ok := os.LookupEnv("COUCHDB_ADDRESS")
	if !ok {
		log.Fatalf("failed to retrieve the couchdb address")
	}
	databaseName := "conversations"

	// connect to couchdb
	client, err := kivik.New("couch", fmt.Sprintf("http://%s:%s@%s/", couchdbUser, couchdbPassword, couchdbAddress))
	if err != nil {
		log.Fatalf("failed to connect to couchdb: %v", err)
	}
	s.couchdbClient = client

	// Create or get a database
	exists, err := client.DBExists(ctx, databaseName)
	if err != nil {
		log.Fatalf("failed to check if database exists: %v", err)
	} else if !exists {
		// Database doesn't exist, create it
		if err := client.CreateDB(ctx, databaseName); err != nil {
			log.Fatalf("failed to create couchdb database: %v", err)
		}
	}

	s.conversationsDB = client.DB(databaseName)
}

func main() {
	// graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

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

	// Connect to google gemini
	server.connectToGoogleGemini()
	defer server.geminiClient.Close()

	// Connect to couchdb
	server.connectToCouchDB(ctx)
	defer server.couchdbClient.Close()
	defer server.conversationsDB.Close()

	// listen for shutdown signal
	<-sigChan // TODO: implement worker groups
	log.Print("gracefully shutting down...")
}
