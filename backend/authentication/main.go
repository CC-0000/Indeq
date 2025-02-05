package main

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"database/sql"
	"encoding/base64"
	"fmt"
	"log"
	"net"
	"os"
	"strconv"
	"strings"
	"time"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/argon2"
	"google.golang.org/grpc"
)

type authServer struct {
	pb.UnimplementedAuthenticationServiceServer
    db *sql.DB // password database
    jwtSecret []byte // secret for creating jwts
}

type params struct {
    memory      uint32
    iterations  uint32
    parallelism uint8
    saltLength  uint32
    keyLength   uint32
}

var (
    p *params

    MinPasswordLength int
    MaxPasswordLength int
    MaxEmailLength   int
)

func loadPasswordSettings() error {
    // Load parameters with defaults
    memory, err := strconv.ParseUint(os.Getenv("ARGON2_MEMORY"), 10, 32)
    if err != nil {
        memory = 64 * 1024 // default_fallback
    }

    iterations, err := strconv.ParseUint(os.Getenv("ARGON2_ITERATIONS"), 10, 32)
    if err != nil {
        iterations = 3 // default
    }

    parallelism, err := strconv.ParseUint(os.Getenv("ARGON2_PARALLELISM"), 10, 8)
    if err != nil {
        parallelism = 2 // default
    }

    saltLength, err := strconv.ParseUint(os.Getenv("ARGON2_SALT_LENGTH"), 10, 32)
    if err != nil {
        saltLength = 16 // default
    }

    keyLength, err := strconv.ParseUint(os.Getenv("ARGON2_KEY_LENGTH"), 10, 32)
    if err != nil {
        keyLength = 32 // default
    }

    p = &params{
        memory:      uint32(memory),
        iterations:  uint32(iterations),
        parallelism: uint8(parallelism),
        saltLength:  uint32(saltLength),
        keyLength:   uint32(keyLength),
    }

    // Load constraints with defaults
    MinPasswordLength, _ = strconv.Atoi(os.Getenv("MIN_PASSWORD_LENGTH"))
    if MinPasswordLength <= 0 {
        MinPasswordLength = 8
    }

    MaxPasswordLength, _ = strconv.Atoi(os.Getenv("MAX_PASSWORD_LENGTH"))
    if MaxPasswordLength <= 0 {
        MaxPasswordLength = 72
    }

    MaxEmailLength, _ = strconv.Atoi(os.Getenv("MAX_EMAIL_LENGTH"))
    if MaxEmailLength <= 0 {
        MaxEmailLength = 255
    }

    return nil
}

// Password length validation
func validatePassword(password string) error {
    if len(password) < MinPasswordLength {
        return fmt.Errorf("password must be at least %d characters", MinPasswordLength)
    }
    if len(password) > MaxPasswordLength {
        return fmt.Errorf("password must not exceed %d characters", MaxPasswordLength)
    }
	return nil
}

// Email length validation
func validateEmail(email string) error {
    if len(email) > MaxEmailLength {
        return fmt.Errorf("email must not exceed %d characters", MaxEmailLength)
    }
    if len(email) <= 0 {
        return fmt.Errorf("email must not be blank")
    }
    return nil
}

func (s *authServer) checkRateLimit(ctx context.Context, email string) (bool, error) {
	// implement rate limiting here
	return false, nil
}

func (s *authServer) incrementFailedAttempts(ctx context.Context, email string) error {
    // implement failed attempts tracking here
    return nil
}

func (s *authServer) resetFailedAttempts(ctx context.Context, email string) error {
    // implement resetting the counter here
    return nil
}

func comparePasswordAndEncodedHash(password string, encodedHash string) (bool, error) {
	// Unencode the configuration variables from the password hash and salt
    parts := strings.Split(encodedHash, "$")
    if len(parts) != 6 {
        return false, fmt.Errorf("invalid hash format")
    }
	// Get the version
    var version int
    _, err := fmt.Sscanf(parts[2], "v=%d", &version)
    if err != nil {
        return false, err
    }
	// Get the memory constraint, number of iterations, and amt of parallelism
    var memory uint32
    var iterations uint32
    var parallelism uint8
    _, err = fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &memory, &iterations, &parallelism)
    if err != nil {
        return false, err
    }
	// Get the salt
    salt, err := base64.RawStdEncoding.DecodeString(parts[4])
    if err != nil {
        return false, err
    }
	// Get the hash
    decodedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
    if err != nil {
        return false, err
    }

	// Compute the hash of the incoming password
    computedHash := argon2.IDKey(
        []byte(password),
        salt,
        iterations,
        memory,
        parallelism,
        uint32(len(decodedHash)),
    )

    // Constant-time comparison
    return subtle.ConstantTimeCompare(computedHash, decodedHash) == 1, nil
}

// Login route
func (s *authServer) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
    var (
        id          string
        encodedHash  string
    )
    
	// Rate limit
	if exceeded, err := s.checkRateLimit(ctx, req.Email); err != nil {
        return nil, err
    } else if exceeded {
        return &pb.LoginResponse{Error: "too many attempts, please try again later"}, nil
    }

	// get the id and encoded password hash matching user email
    err := s.db.QueryRowContext(ctx, 
        "SELECT id, password_hash FROM users WHERE email = $1",
        strings.ToLower(req.Email),
    ).Scan(&id, &encodedHash)

    if err == sql.ErrNoRows {
		// Even though thhe user doesn't exist we want to fake a comparison
		dummyEncodedHash := fmt.Sprintf(
			"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
			argon2.Version,
			p.memory,
			p.iterations,
			p.parallelism,
			"AAAAAAAAAAAAAAAA",
			"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
		)
        comparePasswordAndEncodedHash(req.Password, dummyEncodedHash)
        return &pb.LoginResponse{Error: "invalid credentials"}, nil
    }
    if err != nil {
        return nil, err
    }

    match, err := comparePasswordAndEncodedHash(req.Password, encodedHash)
    if err != nil {
        return &pb.LoginResponse{Error: "invalid credentials"}, nil
    }

	if !match {
        // Increment failed attempts counter
		s.incrementFailedAttempts(ctx, req.Email)
        return &pb.LoginResponse{Error: "invalid credentials"}, nil
    } else {
		s.resetFailedAttempts(ctx, req.Email)
	}
	
	currentTime := time.Now()
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "sub": id,
        "exp": currentTime.Add(24 * time.Hour).Unix(),
        "iat": currentTime.Unix(),
		"nbf": currentTime.Unix(),
    })

    tokenString, err := token.SignedString(s.jwtSecret)
    if err != nil {
        return nil, err
    }

    return &pb.LoginResponse{Token: tokenString}, nil
}

// Register route
func (s *authServer) Register(ctx context.Context, req *pb.RegisterRequest) (*pb.RegisterResponse, error) {
	// Make sure email is good
    if err := validateEmail(req.Email); err != nil {
        return &pb.RegisterResponse{
            Success: false,
            Error:   fmt.Sprintf("invalid email: %v", err),
        }, nil
    }

	// Make sure name is good
    if err := validateEmail(req.Name); err != nil {
        return &pb.RegisterResponse{
            Success: false,
            Error:   fmt.Sprintf("invalid name: %v", err),
        }, nil
    }

	// Make sure password is good
    if err := validatePassword(req.Password); err != nil {
        return &pb.RegisterResponse{
            Success: false,
            Error:   fmt.Sprintf("invalid password: %v", err),
        }, nil
    }

    // Generate a random salt
    salt := make([]byte, p.saltLength)
    if _, err := rand.Read(salt); err != nil {
        return nil, err
    }

	// Generate a password hash
    hash := argon2.IDKey(
        []byte(req.Password),
        salt,
        p.iterations,
        p.memory,
        p.parallelism,
        p.keyLength,
    )

	// Keep encryption details alongside the hash
    encodedHash := fmt.Sprintf(
        "$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
        argon2.Version,
        p.memory,
        p.iterations,
        p.parallelism,
        base64.RawStdEncoding.EncodeToString(salt),
        base64.RawStdEncoding.EncodeToString(hash),
    )

	// Store in the database
    tx, err := s.db.BeginTx(ctx, nil)
    if err != nil {
        return nil, fmt.Errorf("failed to begin transaction: %v", err)
    }
    defer tx.Rollback()

    _, err = tx.ExecContext(ctx,
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
        strings.ToLower(req.Email), // Normalize email
        encodedHash,
        req.Name,
    )
    
    if err != nil {
        return &pb.RegisterResponse{
            Success: false,
            Error:   "email already exists",
        }, nil
    }

    if err := tx.Commit(); err != nil {
        return nil, fmt.Errorf("failed to commit transaction: %v", err)
    }

    return &pb.RegisterResponse{Success: true}, nil
}

// Verify jwt route
func (s *authServer) Verify(ctx context.Context, req *pb.VerifyRequest) (*pb.VerifyResponse, error) {
    // parse out the token
    token, err := jwt.Parse(req.Token, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, jwt.ErrSignatureInvalid
        }
        return s.jwtSecret, nil
    })

    // check if token was able to be parsed
    if err != nil {
        log.Printf("Failed to parse token: %v", err)
		return &pb.VerifyResponse{Valid: false, Error: "invalid token"}, nil
    }

    // verify validity of token
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        return &pb.VerifyResponse{
            Valid: true,
            UserId: claims["sub"].(string),
        }, nil
    }

    return &pb.VerifyResponse{Valid: false, Error: "invalid token"}, nil
}

func main() {
	log.Println("Starting the auth server...")
	// Load all environmental variables
    err := config.LoadSharedConfig()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
    if err := loadPasswordSettings(); err != nil {
        log.Fatalf("Failed to initialize password encryption settings: %v", err)
    }

	grpcAddress := os.Getenv("AUTH_PORT")

    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        log.Fatal("DATABASE_URL environment variable is required")
    }

    jwtSecret := []byte(os.Getenv("JWT_SECRET"))
    if len(jwtSecret) == 0 {
        log.Fatal("JWT_SECRET environment variable is required")
    }

    // Connect to database
    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    defer db.Close()

	// Set up database tables
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    _, err = db.ExecContext(ctx, `
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `)
    if err != nil {
        log.Fatalf("Failed to create tables: %v", err)
    }

    _, err = db.ExecContext(ctx, `
        CREATE INDEX IF NOT EXISTS email_idx ON users(email)
    `)
    if err != nil {
        log.Fatalf("Failed to create email index: %v", err)
    }

    listener, err := net.Listen("tcp", grpcAddress)
    if err != nil {
        log.Fatalf("Failed to listen: %v", err)
    }
	defer listener.Close()

	log.Println("Creating the authentication server")

    grpcServer := grpc.NewServer()
    pb.RegisterAuthenticationServiceServer(grpcServer, &authServer{db: db, jwtSecret: jwtSecret})
    log.Printf("Auth Service listening on %v\n", listener.Addr())
    if err := grpcServer.Serve(listener); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    } else {
		log.Printf("Auth Service served on %v\n", listener.Addr())
	}
}