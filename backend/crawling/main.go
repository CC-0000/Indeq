package main

import (
	"context"
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
	"golang.org/x/oauth2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type crawlingServer struct {
	pb.UnimplementedCrawlingServiceServer
	integrationConn    *grpc.ClientConn
	integrationService pb.IntegrationServiceClient
	vectorConn         *grpc.ClientConn
	vectorService      pb.VectorServiceClient
	db                 *sql.DB
}

type Metadata struct {
	DateCreated      time.Time // Universal timestamp for creation
	DateLastModified time.Time // Universal timestamp for last modification
	UserID           string    // Unique identifier for the user
	ResourceID       string    // Unique ID of the resource (platform-specific)
	ResourceType     string    // Standardized type (e.g., "document", "spreadsheet", "email")
	FileURL          string    // URL
	Title            string    // Title or subject of the resource

	ChunkID     string // Use to uniquely identify chunks
	ChunkSize   uint64 // Used to determine the size of the chunk
	ChunkNumber uint64 // Identifies the chunk in that sequence

	FilePath string // Folder structure
	Platform string // Platform identifier ("GOOGLE_DRIVE", "GOOGLE_GMAIL", "MICROSOFT", "NOTION")
	Provider string // Provider identifier ("GOOGLE", "MICROSOFT", "NOTION")
	Exists   bool   // Whether the resource exists
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

// ValidateAccessToken validates an access token for a specific provider
func ValidateAccessToken(accessToken, provider string) ([]string, error) {
	if provider == "GOOGLE" {
		tokenInfo, err := validateGoogleAccessToken(accessToken)
		if err != nil {
			fmt.Printf("Error validating Google access token: %v\n", err)
			return nil, err
		}
		scopes := strings.Split(tokenInfo.Scope, " ")
		return scopes, nil
	}
	return nil, fmt.Errorf("unsupported provider: %s", provider)
}

// validateGoogleAccessToken validates a Google access token
func validateGoogleAccessToken(accessToken string) (*TokenInfo, error) {
	url := fmt.Sprintf("https://oauth2.googleapis.com/tokeninfo?access_token=%s", accessToken)
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	var tokenInfo TokenInfo
	if err := json.NewDecoder(resp.Body).Decode(&tokenInfo); err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	if tokenInfo.Error != "" {
		return &tokenInfo, fmt.Errorf("invalid token: %s - %s", tokenInfo.Error, tokenInfo.ErrorDesc)
	}

	return &tokenInfo, nil
}

func retrieveAccessToken(ctx context.Context, integrationService pb.IntegrationServiceClient, userID, provider string) (string, error) {
	response, err := integrationService.GetAccessToken(ctx, &pb.GetAccessTokenRequest{
		UserId:   userID,
		Provider: convertProviderToEnum(provider),
	})

	if err != nil {
		return "", fmt.Errorf("error calling GetAccessToken: %v", err)
	}

	if !response.Success {
		return "", fmt.Errorf("failed to retrieve access token: %s", response.Message)
	}

	return response.AccessToken, nil
}

// Add a method to retrieve access token
func (s *crawlingServer) retrieveAccessTokenManual(ctx context.Context, userID string, provider string) (string, error) {
	response, err := s.integrationService.GetAccessToken(ctx, &pb.GetAccessTokenRequest{
		UserId:   userID,
		Provider: convertProviderToEnum(provider),
	})

	if err != nil {
		return "", fmt.Errorf("error calling GetAccessToken: %v", err)
	}

	if !response.Success {
		return "", fmt.Errorf("failed to retrieve access token: %s", response.Message)
	}

	return response.AccessToken, nil
}

// Helper function to convert provider string to enum
func convertProviderToEnum(provider string) pb.Provider {
	switch provider {
	case "GOOGLE":
		return pb.Provider_GOOGLE
	case "MICROSOFT":
		return pb.Provider_MICROSOFT
	case "NOTION":
		return pb.Provider_NOTION
	default:
		return pb.Provider_GOOGLE // Default or handle error as needed
	}
}

func (s *crawlingServer) StartInitialCrawler(ctx context.Context, req *pb.StartInitalCrawlerRequest) (*pb.StartInitalCrawlerResponse, error) {
	providerStr := req.Provider
	scope, err := ValidateAccessToken(req.AccessToken, providerStr)
	if err != nil {
		return &pb.StartInitalCrawlerResponse{
			Success:      false,
			Message:      fmt.Sprintf("Failed to validate access token: %v", err),
			ErrorDetails: err.Error(),
		}, nil
	}
	_, err = s.NewCrawler(ctx, req.UserId, req.AccessToken, providerStr, scope)
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
func (s *crawlingServer) NewCrawler(ctx context.Context, userID string, accessToken string, provider string, scopes []string) (ListofFiles, error) {
	switch provider {
	case "GOOGLE":
		client := createGoogleOAuthClient(ctx, accessToken)
		files, err := s.GoogleCrawler(ctx, client, userID, scopes)
		return files, err
	default:
		return ListofFiles{}, fmt.Errorf("unsupported provider: %s", provider)
	}
}

// UpdateCrawler goes through specific provider and return the new retrieval token and processed files
func UpdateCrawler(ctx context.Context, accessToken string, retrievalToken string, provider string, service string, userID string) (string, ListofFiles, error) {
	switch provider {
	case "GOOGLE":
		client := createGoogleOAuthClient(ctx, accessToken)
		newRetrievalToken, processedFiles, err := UpdateCrawlGoogle(ctx, client, service, userID, retrievalToken)
		if err != nil {
			return "", ListofFiles{}, fmt.Errorf("error updating Google crawl: %w", err)
		}
		return newRetrievalToken, processedFiles, nil
	default:
		return "", ListofFiles{}, fmt.Errorf("unsupported provider: %s", provider)
	}
}

// RetrieveCrawler retrieves a specific chunk from a Google Doc based on its ChunkID
func RetrieveCrawler(ctx context.Context, accessToken string, metadataList []Metadata) (File, error) {
	textChunks := make([]TextChunkMessage, 0)
	for _, metadata := range metadataList {
		switch metadata.Provider {
		case "GOOGLE":
			client := createGoogleOAuthClient(ctx, accessToken)
			textChunk, err := RetrieveGoogleCrawler(ctx, client, metadata)
			textChunks = append(textChunks, textChunk)
			if err != nil {
				return File{}, fmt.Errorf("error retrieving Google Doc chunk: %w", err)
			}
		default:
			return File{}, fmt.Errorf("unsupported provider: %s", metadata.Provider)
		}
	}
	return File{File: textChunks}, nil
}

// ManualCrawler updates the crawler when user presses update to make sure data is up-to-date
func (s *crawlingServer) ManualCrawler(ctx context.Context, req *pb.ManualCrawlerRequest) (*pb.ManualCrawlerResponse, error) {
	var found bool
	rows, err := s.db.QueryContext(ctx, `
		SELECT provider, service, retrieval_token
		FROM retrievalTokens
		WHERE user_id = $1
		FOR UPDATE
	`, req.UserId)
	if err != nil {
		return nil, fmt.Errorf("error querying retrieval tokens: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			provider       string
			service        string
			retrievalToken string
		)
		if err := rows.Scan(&provider, &service, &retrievalToken); err != nil {
			return nil, fmt.Errorf("error scanning retrieval token: %w", err)
		}
		found = true

		// Retrieve access token using the integration service
		accessToken, err := s.retrieveAccessTokenManual(ctx, req.UserId, provider)
		if err != nil {
			log.Printf("Error retrieving access token: %v", err)
			continue
		}

		processedFile, err := updateCrawlerWithToken(ctx, s.db, req.UserId, provider, service, retrievalToken, accessToken)
		if err != nil {
			log.Printf("Error updating crawler: %v", err)
			continue
		}
		log.Printf("Processed %d files for user %s", len(processedFile.Files), req.UserId)
	}

	if !found {
		return &pb.ManualCrawlerResponse{Success: false}, nil
	}
	return &pb.ManualCrawlerResponse{Success: true}, nil
}

// startPeriodicCrawlerWorker starts a periodic crawler worker
func startPeriodicCrawlerWorker(db *sql.DB, integrationService pb.IntegrationServiceClient) {
	ticker := time.NewTicker(time.Second * 30)
	go func() {
		for range ticker.C {
			log.Println("Running periodic crawler worker...")
			UpdateDBCrawler(db, integrationService)
		}
	}()
}

// UpdateDBCrawler updates the crawler with new access tokens to make sure data is up-to-date
func UpdateDBCrawler(db *sql.DB, integrationService pb.IntegrationServiceClient) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	rows, err := db.QueryContext(ctx, `
		SELECT user_id, provider, service, retrieval_token
		FROM retrievalTokens
		WHERE updated_at < NOW() - INTERVAL '1 minutes'
		AND requires_update = TRUE
		FOR UPDATE
	`)

	if err != nil {
		log.Printf("Error querying retrieval tokens: %v", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var (
			userID         string
			provider       string
			service        string
			retrievalToken string
		)
		err := rows.Scan(&userID, &provider, &service, &retrievalToken)
		if err != nil {
			log.Printf("Error scanning retrieval token: %v", err)
			continue
		}

		// Retrieve access token using the integration service
		accessToken, err := retrieveAccessToken(ctx, integrationService, userID, provider)
		if err != nil {
			log.Printf("Error retrieving access token: %v", err)
			continue
		}
		processedFiles, err := updateCrawlerWithToken(ctx, db, userID, provider, service, retrievalToken, accessToken)
		if err != nil {
			log.Printf("[UPDATE] Error updating crawler: %v", err)
			continue
		}
		log.Printf("Processed %d files for user %s", len(processedFiles.Files), userID)
	}
}

// createOAuthClient creates an OAuth client from an access token
func createGoogleOAuthClient(ctx context.Context, accessToken string) *http.Client {
	tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken})
	return oauth2.NewClient(ctx, tokenSource)
}

// updateCrawlerWithToken updates the crawler with a new access token
func updateCrawlerWithToken(ctx context.Context, db *sql.DB, userID, provider, service, retrievalToken, accessToken string) (ListofFiles, error) {
	newRetrievalToken, processedFiles, err := UpdateCrawler(ctx, accessToken, retrievalToken, provider, service, userID)
	if err != nil {
		log.Printf("Error updating crawler: %v", err)
		return ListofFiles{}, err
	}
	if err := storeRetrievalToken(ctx, db, userID, provider, service, newRetrievalToken); err != nil {
		return ListofFiles{}, err
	}
	return processedFiles, nil
}

// storeRetrievalToken stores a new retrieval token or updates an existing one
func storeRetrievalToken(ctx context.Context, db *sql.DB, userID, provider, service, retrievalToken string) error {
	_, err := db.ExecContext(ctx, `
        INSERT INTO retrievalTokens (user_id, provider, service, retrieval_token, created_at, updated_at, requires_update)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id, service)
        DO UPDATE SET retrieval_token = EXCLUDED.retrieval_token, 
                      updated_at = EXCLUDED.updated_at, 
                      requires_update = EXCLUDED.requires_update
    `, userID, provider, service, retrievalToken, time.Now(), time.Now(), true)
	if err != nil {
		log.Printf("Failed to store retrieval token: %v", err)
	}
	return err
}

// setupDatabase creates and configures the database tables
func setupDatabase(db *sql.DB) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := db.ExecContext(ctx, `
        CREATE TABLE IF NOT EXISTS retrievalTokens (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL,
			provider TEXT NOT NULL CHECK (provider IN ('GOOGLE', 'NOTION')),
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

	fmt.Println("Database setup completed: retrieval_tokens table is ready.")
	return nil
}

func (s *crawlingServer) DeleteCrawlerData(ctx context.Context, req *pb.DeleteCrawlerDataRequest) (*pb.DeleteCrawlerDataResponse, error) {
	// Delete rows from retrievalTokens table for the given user_id and provider
	result, err := s.db.ExecContext(ctx, `
		DELETE FROM retrievalTokens
		WHERE user_id = $1 AND provider = $2
	`, req.UserId, req.Provider)

	if err != nil {
		return &pb.DeleteCrawlerDataResponse{
			Success: false,
			Message: fmt.Sprintf("Database error deleting crawler data: %v", err),
		}, nil
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return &pb.DeleteCrawlerDataResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to get rows affected: %v", err),
		}, nil
	}

	if rowsAffected == 0 {
		return &pb.DeleteCrawlerDataResponse{
			Success: true,
			Message: "No crawler data found to delete",
		}, nil
	}

	return &pb.DeleteCrawlerDataResponse{
		Success: true,
		Message: "Crawler data deleted successfully",
	}, nil
}

func main() {
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
	integrationTLSConfig, err := config.LoadClientTLSFromEnv("INTEGRATION_CRT", "INTEGRATION_KEY", "CA_CRT")
	if err != nil {
		log.Fatal("Error loading TLS client config for integration service")
	}
	integrationAddress := os.Getenv("INTEGRATION_ADDRESS")
	if integrationAddress == "" {
		log.Fatalf("INTEGRATION_ADDRESS environment variable is required")
	}
	integrationConn, err := grpc.NewClient(
		integrationAddress,
		grpc.WithTransportCredentials(credentials.NewTLS(integrationTLSConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to connect to integration service: %v", err)
	}
	defer integrationConn.Close()

	integrationService := pb.NewIntegrationServiceClient(integrationConn)

	vectorTLSConfig, err := config.LoadClientTLSFromEnv("VECTOR_CRT", "VECTOR_KEY", "CA_CRT")
	if err != nil {
		log.Fatal("Error loading TLS client config for vector service")
	}
	vectorAddress := os.Getenv("VECTOR_ADDRESS")
	if vectorAddress == "" {
		log.Fatalf("VECTOR_ADDRESS environment variable is required")
	}
	vectorConn, err := grpc.NewClient(
		vectorAddress,
		grpc.WithTransportCredentials(credentials.NewTLS(vectorTLSConfig)),
	)
	if err != nil {
		log.Fatalf("Failed to connect to vector service: %v", err)
	}
	defer vectorConn.Close()
	vectorService := pb.NewVectorServiceClient(vectorConn)

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

	startPeriodicCrawlerWorker(db, integrationService)

	opts := []grpc.ServerOption{
		grpc.Creds(credentials.NewTLS(tlsConfig)),
	}
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterCrawlingServiceServer(grpcServer, &crawlingServer{
		db:                 db,
		integrationConn:    integrationConn,
		integrationService: integrationService,
		vectorConn:         vectorConn,
		vectorService:      vectorService,
	})
	log.Printf("Crawling Service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	} else {
		log.Printf("Crawling Service served on %v\n", listener.Addr())
	}
}
