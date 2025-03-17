package main

import (
	"context"
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
}
