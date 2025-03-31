package main

import (
	"context"
	"crypto/tls"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	_ "github.com/lib/pq"
	"github.com/segmentio/kafka-go"
	"golang.org/x/oauth2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type crawlingServer struct {
	pb.UnimplementedCrawlingServiceServer
	integrationConn    *grpc.ClientConn
	integrationService pb.IntegrationServiceClient
	vectorConn         *grpc.ClientConn
	vectorService      pb.VectorServiceClient
	db                 *sql.DB
	kafkaWriter        *kafka.Writer
}

type Metadata struct {
	DateCreated      time.Time // Universal timestamp for creation
	DateLastModified time.Time // Universal timestamp for last modification
	UserID           string    // Unique identifier for the user
	ResourceID       string    // Unique ID of the resource (platform-specific)
	ResourceType     string    // Standardized type (e.g., "document", "spreadsheet", "email")
	FileURL          string    // URL
	Title            string    // Title or subject of the resource
	ChunkID          string    // Use to uniquely identify chunks
	FilePath         string    // Folder structure
	Platform         string    // Platform identifier ("GOOGLE", "MICROSOFT", "NOTION")
	Service          string    // Service identifier ("GOOGLE_DRIVE", "GOOGLE_GMAIL")
}

type TextChunkMessage struct {
	Metadata Metadata
	Content  string
}

type File struct {
	File []TextChunkMessage
}

type ListofFiles struct {
	Files []File
}

type TokenInfo struct {
	Scope     string `json:"scope"`
	Error     string `json:"error"`
	ErrorDesc string `json:"error_description"`
}

// ValidateAccessToken validates an access token for a specific platform
func ValidateAccessToken(accessToken, platform string) ([]string, error) {
	if platform == "GOOGLE" {
		tokenInfo, err := validateGoogleAccessToken(accessToken)
		if err != nil {
			fmt.Printf("Error validating Google access token: %v\n", err)
			return nil, err
		}
		scopes := strings.Split(tokenInfo.Scope, " ")
		return scopes, nil
	}

	return nil, fmt.Errorf("unsupported platform: %s", platform)
}

// validateGoogleAccessToken validates a Google access token
func validateGoogleAccessToken(accessToken string) (*TokenInfo, error) {
	url := fmt.Sprintf("https://oauth2.googleapis.com/tokeninfo?access_token=%s", accessToken)

	// Create custom HTTP client with increased timeouts
	client := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			TLSHandshakeTimeout: 20 * time.Second,
			IdleConnTimeout:     90 * time.Second,
		},
	}

	maxRetries := 3
	var lastErr error
	for attempt := 0; attempt < maxRetries; attempt++ {
		if attempt > 0 {
			time.Sleep(time.Duration(attempt) * 2 * time.Second)
		}

		resp, err := client.Get(url)
		if err != nil {
			lastErr = fmt.Errorf("attempt %d failed to make request: %v", attempt+1, err)
			continue
		}
		defer resp.Body.Close()

		var tokenInfo TokenInfo
		if err := json.NewDecoder(resp.Body).Decode(&tokenInfo); err != nil {
			lastErr = fmt.Errorf("attempt %d failed to decode response: %v", attempt+1, err)
			continue
		}

		if tokenInfo.Error != "" {
			return &tokenInfo, fmt.Errorf("invalid token: %s - %s", tokenInfo.Error, tokenInfo.ErrorDesc)
		}

		return &tokenInfo, nil
	}

	return nil, fmt.Errorf("all attempts failed, last error: %v", lastErr)
}

// Helper function to convert platform string to Provider enum
func convertPlatformToProvider(platform string) pb.Provider {
	switch strings.ToUpper(platform) {
	case "GOOGLE":
		return pb.Provider_GOOGLE
	case "MICROSOFT":
		return pb.Provider_MICROSOFT
	case "NOTION":
		return pb.Provider_NOTION
	default:
		return pb.Provider_PROVIDER_UNSPECIFIED
	}
}

func convertPlatformToEnum(platform string) pb.Platform {
	switch strings.ToUpper(platform) {
	case "GOOGLE":
		return pb.Platform_PLATFORM_GOOGLE
	case "MICROSOFT":
		return pb.Platform_PLATFORM_MICROSOFT
	case "NOTION":
		return pb.Platform_PLATFORM_NOTION
	default:
		return pb.Platform_PLATFORM_LOCAL
	}
}

func (s *crawlingServer) retrieveAccessToken(ctx context.Context, userID string, platform string) (string, error) {
	response, err := s.integrationService.GetAccessToken(ctx, &pb.GetAccessTokenRequest{
		UserId:   userID,
		Platform: convertPlatformToProvider(platform),
	})
	if err != nil {
		return "", fmt.Errorf("error calling GetAccessToken: %v", err)
	}

	if !response.Success {
		return "", fmt.Errorf("failed to retrieve access token: %s", response.Message)
	}

	_, err = ValidateAccessToken(response.AccessToken, platform)
	if err != nil {
		return "", fmt.Errorf("failed to validate access token: %v", err)
	}

	return response.AccessToken, nil
}

func (s *crawlingServer) StartInitialCrawler(ctx context.Context, req *pb.StartInitalCrawlerRequest) (*pb.StartInitalCrawlerResponse, error) {
	platformStr := req.Platform
	scope, err := ValidateAccessToken(req.AccessToken, platformStr)
	if err != nil {
		return &pb.StartInitalCrawlerResponse{
			Success:      false,
			Message:      fmt.Sprintf("Failed to validate access token: %v", err),
			ErrorDetails: err.Error(),
		}, nil
	}
	_, err = s.NewCrawler(ctx, req.UserId, req.AccessToken, platformStr, scope)

	if err != nil {
		return &pb.StartInitalCrawlerResponse{
			Success:      false,
			Message:      fmt.Sprintf("Failed to start initial crawler: %v", err),
			ErrorDetails: err.Error(),
		}, nil
	}

	return &pb.StartInitalCrawlerResponse{
		Success:      true,
		Message:      "Initial crawler started successfully",
		ErrorDetails: "",
	}, nil
}

// Things that will be crawled Google, Microsoft, Notion
func (s *crawlingServer) NewCrawler(ctx context.Context, userID string, accessToken string, platform string, scopes []string) (ListofFiles, error) {
	switch platform {
	case "GOOGLE":
		client := createGoogleOAuthClient(ctx, accessToken)
		files, err := s.GoogleCrawler(ctx, client, userID, scopes)
		if err != nil {
			log.Printf("Error in GoogleCrawler for user %s: %v", userID, err)
		} else {
			log.Printf("GoogleCrawler completed successfully for user %s", userID)
		}
		return files, err
	default:
		return ListofFiles{}, fmt.Errorf("unsupported platform: %s", platform)
	}
}

// UpdateCrawler goes through specific provider and return the new retrieval token and processed files
func (s *crawlingServer) UpdateCrawler(ctx context.Context, accessToken string, retrievalToken string, platform string, service string, userID string) (string, ListofFiles, error) {
	switch platform {
	case "GOOGLE":
		client := createGoogleOAuthClient(ctx, accessToken)
		newRetrievalToken, processedFiles, err := s.UpdateCrawlGoogle(ctx, client, service, userID, retrievalToken)
		if err != nil {
			return "", ListofFiles{}, fmt.Errorf("error updating Google crawl: %w", err)
		}
		return newRetrievalToken, processedFiles, nil
	default:
		return "", ListofFiles{}, fmt.Errorf("unsupported platform: %s", platform)
	}
}

// RetrieveCrawler retrieves a specific chunk from a Google Doc based on its ChunkID
func RetrieveCrawler(ctx context.Context, accessToken string, metadataList []Metadata) (File, error) {
	textChunks := make([]TextChunkMessage, 0)
	for _, metadata := range metadataList {
		switch metadata.Platform {
		case "GOOGLE":
			client := createGoogleOAuthClient(ctx, accessToken)
			textChunk, err := RetrieveGoogleCrawler(ctx, client, metadata)
			textChunks = append(textChunks, textChunk)
			if err != nil {
				return File{}, fmt.Errorf("error retrieving Google Doc chunk: %w", err)
			}
		default:
			return File{}, fmt.Errorf("unsupported platform: %s", metadata.Platform)
		}
	}
	return File{File: textChunks}, nil
}

// ManualCrawler updates the crawler when user presses update to make sure data is up-to-date
func (s *crawlingServer) ManualCrawler(ctx context.Context, req *pb.ManualCrawlerRequest) (*pb.ManualCrawlerResponse, error) {
	tokens, err := GetRetrievalTokens(ctx, s.db, req.UserId)
	if err != nil {
		return nil, fmt.Errorf("error querying retrieval tokens: %w", err)
	}

	if len(tokens) == 0 {
		return &pb.ManualCrawlerResponse{Success: false}, nil
	}

	for _, token := range tokens {
		accessToken, err := s.retrieveAccessToken(ctx, req.UserId, token.Platform)
		if err != nil {
			log.Printf("Error retrieving access token: %v", err)
			continue
		}

		processedFile, err := updateCrawlerWithToken(ctx, s, req.UserId, token.Platform, token.Service, token.RetrievalToken, accessToken)
		if err != nil {
			log.Printf("Error updating crawler: %v", err)
			continue
		}
		log.Printf("Processed %d files for user %s", len(processedFile.Files), req.UserId)
	}

	return &pb.ManualCrawlerResponse{Success: true}, nil
}

// UpdateDBCrawler updates the crawler with new access tokens to make sure data is up-to-date
func (s *crawlingServer) UpdateDBCrawler() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	tokens, err := GetOutdatedTokens(ctx, s.db)
	if err != nil {
		log.Printf("Error querying outdated tokens: %v", err)
		return
	}

	for _, token := range tokens {
		accessToken, err := s.retrieveAccessToken(ctx, token.UserID, token.Platform)
		if err != nil {
			log.Printf("Error retrieving access token: %v", err)
			continue
		}

		processedFiles, err := updateCrawlerWithToken(ctx, s, token.UserID, token.Platform, token.Service, token.RetrievalToken, accessToken)
		if err != nil {
			log.Printf("Error updating crawler: %v", err)
			continue
		}
		log.Printf("Processed %d files for user %s", len(processedFiles.Files), token.UserID)
	}
}

// startPeriodicCrawlerWorker starts a periodic crawler worker

func (s *crawlingServer) startPeriodicCrawlerWorker(ctx context.Context) {
	ticker := time.NewTicker(time.Second * 30)
	go func() {
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				log.Println("Stopping periodic crawler worker...")
				return
			case <-ticker.C:
				log.Println("Running periodic crawler worker...")
				s.UpdateDBCrawler()
			}
		}
	}()
}

// createOAuthClient creates an OAuth client from an access token
func createGoogleOAuthClient(ctx context.Context, accessToken string) *http.Client {
	tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken})
	return oauth2.NewClient(ctx, tokenSource)
}

// updateCrawlerWithToken updates the crawler with a new access token
func updateCrawlerWithToken(ctx context.Context, s *crawlingServer, userID, platform, service, retrievalToken, accessToken string) (ListofFiles, error) {
	newRetrievalToken, processedFiles, err := s.UpdateCrawlGoogle(ctx, createGoogleOAuthClient(ctx, accessToken), service, userID, retrievalToken)
	if err != nil {
		log.Printf("Error updating crawler: %v", err)
		return ListofFiles{}, err
	}
	if err := storeRetrievalToken(ctx, s.db, userID, platform, service, newRetrievalToken); err != nil {
		return ListofFiles{}, err
	}
	return processedFiles, nil
}

// storeRetrievalToken stores a new retrieval token or updates an existing one
func storeRetrievalToken(ctx context.Context, db *sql.DB, userID, platform, service, retrievalToken string) error {
	token := RetrievalToken{
		UserID:         userID,
		Platform:       platform,
		Service:        service,
		RetrievalToken: retrievalToken,
		RequiresUpdate: true,
	}
	return UpsertRetrievalToken(ctx, db, token)
}

// setupDatabase creates and configures the database tables
func setupDatabase(db *sql.DB) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// create retrievalTokens table
	_, err := db.ExecContext(ctx, `
        CREATE TABLE IF NOT EXISTS retrievalTokens (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL,
			platform TEXT NOT NULL CHECK (platform IN ('GOOGLE', 'NOTION')),
            service TEXT NOT NULL CHECK (service IN ('GOOGLE_DRIVE', 'GOOGLE_GMAIL')),
            retrieval_token TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			requires_update BOOLEAN DEFAULT TRUE,
			UNIQUE (user_id, service)
        );
    `)
	if err != nil {
		return fmt.Errorf("failed to create retrievalTokens table: %v", err)
	}
	_, err = db.ExecContext(ctx, `
		CREATE INDEX IF NOT EXISTS user_service_idx ON retrievalTokens (user_id, service);
	`)
	if err != nil {
		return fmt.Errorf("failed to create user_service index: %v", err)
	}

	// Create processing_status table
	_, err = db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS processing_status (
			id SERIAL PRIMARY KEY,
			user_id UUID NOT NULL,
			resource_id TEXT NOT NULL,
			is_processed BOOLEAN DEFAULT FALSE,
			crawling_done BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			UNIQUE (user_id, resource_id)
		);
	`)
	if err != nil {
		return fmt.Errorf("failed to create processing_status table: %v", err)
	}

	_, err = db.ExecContext(ctx, `
		CREATE INDEX IF NOT EXISTS processing_status_user_idx ON processing_status (user_id);
	`)
	if err != nil {
		return fmt.Errorf("failed to create processing_status_user index: %v", err)
	}

	fmt.Println("Database setup completed: retrieval_tokens and processing_status tables are ready.")
	return nil
}

func (s *crawlingServer) DeleteCrawlerData(ctx context.Context, req *pb.DeleteCrawlerDataRequest) (*pb.DeleteCrawlerDataResponse, error) {
	rowsAffected, err := DeleteRetrievalTokens(ctx, s.db, req.UserId, req.Platform)
	if err != nil {
		return &pb.DeleteCrawlerDataResponse{
			Success: false,
			Message: fmt.Sprintf("Database error deleting crawler data: %v", err),
		}, nil
	}

	if rowsAffected == 0 {
		return &pb.DeleteCrawlerDataResponse{
			Success: true,
			Message: "No crawler data found to delete",
		}, nil
	}

	if err := s.deleteFilesFromVector(ctx, req.UserId, req.Platform); err != nil {
		return &pb.DeleteCrawlerDataResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to delete files from vector service: %v", err),
		}, nil
	}

	return &pb.DeleteCrawlerDataResponse{
		Success: true,
		Message: "Crawler data deleted successfully",
	}, nil
}

// deleteFilesFromVector deletes all files for a user from the vector service
func (s *crawlingServer) deleteFilesFromVector(ctx context.Context, userID string, platform string) error {
	_, err := s.vectorService.DeleteFiles(ctx, &pb.VectorFileDeleteRequest{
		UserId:    userID,
		Platform:  convertPlatformToEnum(platform),
		Exclusive: true,
		Files:     []string{},
	})
	if err != nil {
		return fmt.Errorf("failed to delete files from vector service: %v", err)
	}
	return nil
}

func (s *crawlingServer) connectToTextChunkKafkaWriter() error {
	broker, ok := os.LookupEnv("KAFKA_BROKER_ADDRESS")
	if !ok {
		return fmt.Errorf("failed to retrieve kafka broker address")
	}

	s.kafkaWriter = &kafka.Writer{
		Addr:     kafka.TCP(broker),
		Topic:    "text-chunks",
		Balancer: &kafka.LeastBytes{},
	}

	return nil
}

func (s *crawlingServer) convertToProtoMetadata(metadata Metadata) *pb.Metadata {
	return &pb.Metadata{
		DateCreated:      timestamppb.New(metadata.DateCreated),
		DateLastModified: timestamppb.New(metadata.DateLastModified),
		UserId:           metadata.UserID,
		FilePath:         metadata.FilePath,
		Title:            metadata.Title,
		Platform:         convertPlatformToEnum(metadata.Platform),
		FileId:           metadata.ResourceID,
		ResourceType:     metadata.ResourceType,
		FileUrl:          metadata.FileURL,
		ChunkId:          metadata.ChunkID,
		Service:          metadata.Service,
	}

}

func (s *crawlingServer) sendChunkToVector(ctx context.Context, chunk TextChunkMessage) error {
	protoChunk := &pb.TextChunkMessage{
		Metadata: s.convertToProtoMetadata(chunk.Metadata),
		Content:  chunk.Content,
	}

	data, err := proto.Marshal(protoChunk)
	if err != nil {
		return fmt.Errorf("failed to serialize chunk: %v", err)
	}

	err = s.kafkaWriter.WriteMessages(ctx, kafka.Message{
		Value: data,
	})
	if err != nil {
		return fmt.Errorf("failed to write message to kafka: %v", err)
	}

	return nil
}

func (s *crawlingServer) sendFileDoneSignal(ctx context.Context, userID, filePath string, platform string) error {
	doneChunk := &pb.TextChunkMessage{
		Metadata: &pb.Metadata{
			UserId:   userID,
			FilePath: filePath,
			Platform: convertPlatformToEnum(platform),
		},
		Content: "<file_done>",
	}

	data, err := proto.Marshal(doneChunk)
	if err != nil {
		return fmt.Errorf("failed to serialize file done signal: %v", err)
	}

	err = s.kafkaWriter.WriteMessages(ctx, kafka.Message{
		Value: data,
	})
	if err != nil {
		return fmt.Errorf("failed to write file done signal: %v", err)
	}

	return nil
}

func (s *crawlingServer) sendCrawlDoneSignal(ctx context.Context, userID string, platform string) error {
	doneChunk := &pb.TextChunkMessage{
		Metadata: &pb.Metadata{
			UserId:   userID,
			Platform: convertPlatformToEnum(platform),
		},
		Content: "<crawl_done>",
	}

	data, err := proto.Marshal(doneChunk)
	if err != nil {
		return fmt.Errorf("failed to serialize crawl done signal: %v", err)
	}

	err = s.kafkaWriter.WriteMessages(ctx, kafka.Message{
		Value: data,
	})
	if err != nil {
		return fmt.Errorf("failed to write crawl done signal: %v", err)
	}

	return nil
}

func (s *crawlingServer) startCrawlingSignalReading(ctx context.Context) error {
	broker, ok := os.LookupEnv("KAFKA_BROKER_ADDRESS")
	if !ok {
		return fmt.Errorf("failed to retrieve kafka broker address")
	}

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{broker},
		GroupID:  "google-crawling-signal-readers",
		Topic:    "google-crawling-signals",
		MaxBytes: 10e6,
	})
	defer reader.Close()

	messageCh := make(chan kafka.Message)
	errorCh := make(chan error)

	go func() {
		for {
			select {
			case <-ctx.Done():
				log.Print("Shutting down crawling signal consumer channeler")
				return
			default:
				msg, err := reader.ReadMessage(ctx)
				if err != nil {
					errorCh <- err
				} else {
					messageCh <- msg
				}
			}
		}
	}()

	for {
		select {
		case <-ctx.Done():
			log.Print("Shutting down crawling signal consumer processor...")
			return nil
		case err := <-errorCh:
			if err != nil {
				log.Printf("encountered error while reading from crawling signals kafka stream: %v", err)
			}
		case msg := <-messageCh:
			var signal pb.FileDoneProcessing
			if err := proto.Unmarshal(msg.Value, &signal); err != nil {
				log.Printf("Error unmarshalling message: %v", err)
				continue
			}
			if signal.CrawlingDone {
				s.markCrawlingComplete(signal.UserId)
				log.Printf("crawling done for user %s", signal.UserId)
			} else {
				s.markFileProcessed(signal.UserId, signal.FilePath)
				log.Printf("file done for user %s: %s", signal.UserId, signal.FilePath)
			}
		}
	}
}

func (s *crawlingServer) connectToVectorService(tlsConfig *tls.Config) {
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
	s.vectorService = pb.NewVectorServiceClient(vectorConn)
}

func (s *crawlingServer) connectToIntegrationService(tlsConfig *tls.Config) {
	integrationAddress := os.Getenv("INTEGRATION_ADDRESS")
	if integrationAddress == "" {
		log.Fatalf("INTEGRATION_ADDRESS environment variable is required")
	}
	integrationConn, err := grpc.NewClient(
		integrationAddress,
		grpc.WithTransportCredentials(credentials.NewTLS(tlsConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to connect to integration service: %v", err)
	}

	s.integrationConn = integrationConn
	s.integrationService = pb.NewIntegrationServiceClient(integrationConn)
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	log.Println("Starting the crawling service...")

	// Load the .env file
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatalf("DATABASE_URL environment variable is required")
	}

	// Load the TLS configuration values for integration service
	clientTLSConfig, err := config.LoadClientTLSFromEnv("CRAWLING_CRT", "CRAWLING_KEY", "CA_CRT")
	if err != nil {
		log.Fatal("Error loading TLS client config for integration service")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := setupDatabase(db); err != nil {
		log.Fatalf("Database setup failed: %v", err)
	}

	grpcAddress := os.Getenv("CRAWLING_PORT")
	if grpcAddress == "" {
		log.Fatalf("CRAWLING_PORT environment variable is required")
	}
	tlsConfig, err := config.LoadServerTLSFromEnv("CRAWLING_CRT", "CRAWLING_KEY")
	if err != nil {
		log.Fatalf("Error loading TLS config for crawling service: %v", err)
	}
	listener, err := net.Listen("tcp", grpcAddress)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()

	log.Println("Creating the crawling server")

	// Initialize the crawling server
	server := &crawlingServer{
		db: db,
	}

	server.connectToVectorService(clientTLSConfig)
	defer server.vectorConn.Close()
	server.connectToIntegrationService(clientTLSConfig)
	defer server.integrationConn.Close()
	// Connect to Kafka writer
	if err := server.connectToTextChunkKafkaWriter(); err != nil {
		log.Fatalf("Failed to connect to Kafka writer: %v", err)
	}
	defer server.kafkaWriter.Close()

	// Start the periodic crawler worker
	server.startPeriodicCrawlerWorker(ctx)

	// Start the crawling signal reader
	go func() {
		if err := server.startCrawlingSignalReading(context.Background()); err != nil {
			log.Printf("Error starting crawling signal reader: %v", err)
		}
	}()

	opts := []grpc.ServerOption{
		grpc.Creds(credentials.NewTLS(tlsConfig)),
	}
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterCrawlingServiceServer(grpcServer, server)
	log.Printf("Crawling Service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	} else {
		log.Printf("Crawling Service served on %v\n", listener.Addr())
	}
}
