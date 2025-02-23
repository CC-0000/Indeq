package main

import (
	"context"
	"log"
	"os"
	"time"
	"database/sql"
	"net"

	pb "github.com/cc-0000/indeq/common/api"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

type waitlistServer struct {
	pb.UnimplementedWaitlistServiceServer
	db *sql.DB  // waitlist db
}

func main() {
	log.Println("Starting the waitlist server...")
	
	// Load all environmental variables
	dbURL := os.Getenv("WAITLIST_DATABASE_URL")
	if dbURL == "" {
		log.Fatal("WAITLIST_DATABASE_URL environment variable is required")
	}

	// TODO: Add TLS configuration values
	// Load the TLS configuration values
	// tlsConfig, err := config.LoadTLSFromEnv("WAITLIST_CRT", "WAITLIST_KEY")
	// if err != nil {
	// 	log.Fatal("Error loading TLS config for waitlist service")
	// }

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()

	_, err = db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS waitlist (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		email VARCHAR(255) UNIQUE NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	`)
	if err != nil {
		log.Fatalf("Failed to create tables: %v", err)
	}

	_, err = db.ExecContext(ctx, `
		CREATE INDEX IF NOT EXISTS email_idx ON waitlist(email)
	`)
	if err != nil {
		log.Fatalf("Failed to create email index: %v", err)
	}

	grpcAddress := os.Getenv("WAITLIST_PORT")
	if grpcAddress == "" {
		log.Fatal("WAITLIST_PORT environment variable is required")
	}

	listener, err := net.Listen("tcp", grpcAddress)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()
	
	log.Println("Creating the waitlist server...")

	grpcServer := grpc.NewServer()
	pb.RegisterWaitlistServiceServer(grpcServer, &waitlistServer{db: db})

	log.Printf("Waitlist Service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	} else {
		log.Println("Waitlist server started successfully")
	}
}