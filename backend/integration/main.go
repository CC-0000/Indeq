package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"
    "time"

	pb "github.com/cc-0000/indeq/common/api"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

type integrationServer struct {
    pb.UnimplementedIntegrationServiceServer
    db *sql.DB // integration database
}

func main() {
    log.Println("Starting the integration server...")
    
    // Load all environmetal variables

    dbURL := os.Getenv("INTEGRATION_DATABASE_URL")
    if dbURL == "" {
        log.Fatalf("INTEGRATION_DATABASE_URL envionment variable is required")
    }
    
    // Connect to db
    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    defer db.Close()

    ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
    defer cancel()
    _, err = db.ExecContext(ctx, `
        CREATE TABLE IF NOT EXISTS oauth_tokens (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL,
            provider TEXT NOT NULL CHECK (provider IN ('GOOGLE', 'MICROSOFT', 'NOTION')),
            access_token TEXT NOT NULL,
            refresh_token TEXT NOT NULL,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `)

    if err != nil {
        log.Fatalf("Failed to create oauth_tokens table: %v", err)
    }

    _, err = db.ExecContext(ctx, `
        CREATE INDEX IF NOT EXISTS user_provider_idx ON oauth_tokens(user_id, provider);
    `)

    if err != nil {
        log.Fatalf("Failed to create user_provider index: %v", err)
    }

    fmt.Println("Database setup completed: oauth_tokens table is ready.")
    
    // Pull in GRPC address
    grpcAddress := os.Getenv("INTEGRATION_PORT")
    if grpcAddress == "" {
        log.Fatalf("INTEGRATION_PORT environment variable is required")
    }

    listener, err := net.Listen("tcp", grpcAddress)
    if err != nil {
        log.Fatalf("Failed to listen: %v", err)
    }
    defer listener.Close()

    log.Println("Creating the integration server...")

    grpcServer := grpc.NewServer()
    pb.RegisterIntegrationServiceServer(grpcServer, &integrationServer{db: db})
    log.Printf("Integration Service listening on %v\n", listener.Addr())
    if err := grpcServer.Serve(listener); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    } else {
        log.Printf("Integration Service served on %v\n", listener.Addr())
    }
}