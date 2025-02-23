package main

import (
	"context"
	"log"
	"os"
	"time"
	"database/sql"
	"net"
	"regexp"

	pb "github.com/cc-0000/indeq/common/api"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

type WaitlistServer struct {
	pb.UnimplementedWaitlistServiceServer
	db *sql.DB  // waitlist db
}

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

func (s *WaitlistServer) AddToWaitlist(ctx context.Context, req *pb.AddToWaitlistRequest) (*pb.AddToWaitlistResponse, error) {
	if req.Email == "" || !emailRegex.MatchString(req.Email) {
		return &pb.AddToWaitlistResponse{
			Success: false,
			Message: "Invalid email address",
		}, nil
	}

	var existingEmail bool
	err := s.db.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM waitlist WHERE email = $1)", req.Email).Scan(&existingEmail)
	if err != nil {
		log.Println("Database query error:", err)
		return &pb.AddToWaitlistResponse{
			Success: false,
			Message: "Database error. Please try again later.",
		}, nil
	}

	if existingEmail {
		return &pb.AddToWaitlistResponse{
			Success: false,
			Message: "You're already on the waitlist! 😊",
		}, nil
	}
	
	_, err = s.db.ExecContext(ctx, "INSERT INTO waitlist (email) VALUES ($1)", req.Email)
	if err != nil {
		log.Println("Database insert error:", err)
		return &pb.AddToWaitlistResponse{
			Success: false,
			Message: "Could not add to waitlist. Please try again later.",
		}, nil
	}

	return &pb.AddToWaitlistResponse{
		Success: true,
		Message: "You're on the waitlist! 🎉",
	}, nil
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
	pb.RegisterWaitlistServiceServer(grpcServer, &WaitlistServer{db: db})

	log.Printf("Waitlist Service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	} else {
		log.Println("Waitlist server started successfully")
	}
}