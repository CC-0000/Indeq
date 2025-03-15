package main

import (
	"context"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
	"golang.org/x/oauth2"
)

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

	Hierarchy string // Folder structure
	Platform  string // Platform identifier ("google", "microsoft", "notion")
	Provider  string // Provider identifier ("GOOGLE", "MICROSOFT", "NOTION")
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

func TimeExecution(name string, fn func() error) error {
	start := time.Now()
	err := fn()
	elapsed := time.Since(start)
	log.Printf("%s took %v to complete", name, elapsed)
	return err
}

// TODO: need a way to get user id into metadata

// TODO: function that makes request to integration service to get access token, scopes, by sending user_id

// Things that will be crawled Google, Microsoft, Notion
func NewCrawler(ctx context.Context, accessToken string, provider string, scopes []string) error {
	switch provider {
	case "GOOGLE":
		tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken})
		client := oauth2.NewClient(ctx, tokenSource)
		return GoogleCrawler(ctx, client, scopes)
	case "MICROSOFT":
		return nil
	case "NOTION":
		return nil
		//return NotionCrawler(ctx, client, scopes)

	// Add more providers as needed
	default:
		return nil
	}
}

func RetrieveCrawler(ctx context.Context, metadata Metadata) error {
	// function to get access Token
	accessToken := ""
	switch metadata.Provider {
	case "GOOGLE":
		tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken})
		client := oauth2.NewClient(ctx, tokenSource)
		_, err := RetrieveGoogleCrawler(ctx, client, metadata)
		return err
	case "MICROSOFT":
		return nil
	case "NOTION":
		return nil
		//return NotionCrawler(ctx, client, scopes)

	// Add more providers as needed
	default:
		return nil
	}
}

// func ChunkData(words []string, baseMetadata Metadata) []TextChunkMessage {
// 	totalWords := uint64(len(words))
// 	baseChunkSize := uint64(400)
// 	baseOverlapAmount := uint64(80)
// 	effectiveChunkSize := baseChunkSize - baseOverlapAmount
// 	totalChunks := uint64(math.Ceil(float64(totalWords) / float64(effectiveChunkSize)))
// 	chunks := make([]TextChunkMessage, 0, totalChunks)

// 	if totalWords == 0 {
// 		return []TextChunkMessage{}
// 	}
// 	if totalWords < baseChunkSize {
// 		baseChunkSize = totalWords
// 	}
// 	for i := uint64(0); i < totalChunks; i++ {
// 		start := i * effectiveChunkSize
// 		end := start + baseChunkSize

// 		if start >= totalWords {
// 			break
// 		}

// 		if end >= totalWords {
// 			if start+baseOverlapAmount >= totalWords {
// 				break
// 			}
// 			end = totalWords
// 			start = max(0, end-baseChunkSize)

// 		}
// 		chunkWords := words[start:end]

// 		chunkMetadata := baseMetadata
// 		chunkMetadata.ChunkNumber = i + 1
// 		chunkMetadata.ChunkSize = uint64(len(chunkWords))

// 		chunks = append(chunks, TextChunkMessage{
// 			Metadata: chunkMetadata,
// 			Content:  strings.Join(chunkWords, " "),
// 		})

// 	}

// 	return chunks
// }

func main() {
	log.Println("Starting the crawling server...")
	//Load the .env file
	// err := config.LoadSharedConfig()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	// // Load Database
	// dbURL := os.Getenv("DATABASE_URL")
	// if dbURL == "" {
	// 	log.Fatal("DATABASE_URL environment variable is required")
	// }

	// // Connect to Database
	// db, err := sql.Open("postgres", dbURL)
	// if err != nil {
	// 	log.Fatalf("Failed to connect to database: %v", err)
	// }
	// defer db.Close()

	// //Setup database tables
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()
	// _, err = db.ExecContext(ctx, `
	// 	CREATE TABLE IF NOT EXISTS crawled_sync_token (
	// 		id SERIAL PRIMARY KEY,
	// 		user_id UUID NOT NULL,
	// 		service TEXT NOT NULL CHECK (service IN ('GOOGLE_DRIVE','ONE_DRIVE')),
	// 		sync_token TEXT NOT NULL,
	// 		synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	// 		resync_required BOOLEAN DEFAULT TRUE,
	// 		UNIQUE (user_id, service)
	// 	);
	// `)

	// if err != nil {
	// 	log.Fatalf("Failed to create crawled_sync_token table: %v", err)
	// }

	// _, err = db.ExecContext(ctx, `
	// 	CREATE INDEX IF NOT EXISTS user_service_idx ON crawled_sync_token(user_id, service);
	// `)
	// if err != nil {
	// 	log.Fatalf("Failed to create user_service index: %v", err)
	// }
	// log.Fatalf("Database (crawling) setup completed: crawled_sync_token table is ready.")
	ctx := context.Background()

	// Get access token from integration service
	accessToken := "ya29.a0AeXRPp5Z8l5vpvAHGMhLI8FlCyZcRzMXPD5lMBiXzN7f6TalSbWldhwHkPYDkqpoljiqA2Zc9JRz05Odacb9EKzWxTYTUgDISnoROdHGO2VhitIijlYfKJp9F65XV0vlmGiv3qGE6CtZc0fM-kF-tPTRaRY_cCAO2UZlCVYvaCgYKAQASARMSFQHGX2MiMm3WB3VGqmK9TnucHRQURw0175"
	NewCrawler(ctx, accessToken, "GOOGLE", []string{"https://www.googleapis.com/auth/drive.readonly"})

	log.Println("\n\n--- TESTING RETRIEVAL ---")

	// Create a test metadata object for retrieval
	testMetadata := Metadata{
		UserID:       "a",
		ResourceID:   "1YzV312pJyFfLgpuB2Ng8qu5pFup4Q_v3XoNj8db1lbk", // Replace with a real document ID from your initial crawl
		ResourceType: "application/vnd.google-apps.document",
		ChunkID:      "1-0-11-2013", // Assuming this chunk exists, adjust as needed
		Provider:     "GOOGLE",
	}

	// Print the metadata we're using for retrieval
	fmt.Printf("Attempting to retrieve with metadata:\n")
	fmt.Printf("  UserID: %s\n", testMetadata.UserID)
	fmt.Printf("  ResourceID: %s\n", testMetadata.ResourceID)
	fmt.Printf("  ResourceType: %s\n", testMetadata.ResourceType)
	fmt.Printf("  ChunkID: %s\n", testMetadata.ChunkID)
	fmt.Printf("  Provider: %s\n\n", testMetadata.Provider)

	// Test direct retrieval
	tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken})
	client := oauth2.NewClient(ctx, tokenSource)

	result, err := RetrieveGoogleCrawler(ctx, client, testMetadata)
	if err != nil {
		log.Printf("Retrieval failed: %v", err)
	} else {
		fmt.Println("=== SUCCESSFULLY RETRIEVED CHUNK ===")
		fmt.Printf("Chunk ID: %s\n", result.Metadata.ChunkID)
		fmt.Printf("Chunk Number: %d\n", result.Metadata.ChunkNumber)
		fmt.Printf("Chunk Size: %d\n", result.Metadata.ChunkSize)
		fmt.Printf("Content: %s\n", result.Content)
		fmt.Println("=====================================")
	}
}
