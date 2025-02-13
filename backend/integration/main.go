package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"
    "encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	pb "github.com/cc-0000/indeq/common/api"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

type integrationServer struct {
    pb.UnimplementedIntegrationServiceServer
    db *sql.DB // integration database
}

// TokenResponse represents the OAuth token response from our providers
type TokenResponse struct {
	AccessToken string 
	RefreshToken string
	ExpiresIn int
	ExpiresAt time.Time
}

// OAuthProviderConfig represents the token exchange and refresh
type OAuthProviderConfig struct {
	TokenURL string
	ClientID string
	ClientSecret string
	RedirectURI string
}

// OAuth provider configurations
var providers = map[string]OAuthProviderConfig{
	"GOOGLE": {
		TokenURL:     "https://oauth2.googleapis.com/token",
		ClientID:     "your_google_client_id",
		ClientSecret: "your_google_client_secret",
		RedirectURI:  "your_redirect_uri",
	},
	"MICROSOFT": {
		TokenURL:     "https://login.microsoftonline.com/common/oauth2/v2.0/token",
		ClientID:     "your_microsoft_client_id",
		ClientSecret: "your_microsoft_client_secret",
		RedirectURI:  "your_redirect_uri",
	},
	"NOTION": {
		TokenURL:     "https://api.notion.com/v1/oauth/token",
		ClientID:     "your_notion_client_id",
		ClientSecret: "your_notion_client_secret",
		RedirectURI:  "your_redirect_uri",
	},
}

// Exchanges an auth code for access & refresh token
func ExchangeAuthCodeForToken(provider string, authCode string) (*TokenResponse, error) {
	config, exists := providers[provider]
	if !exists {
		return nil, errors.New("unsupported provider")
	}

	data := fmt.Sprintf(
		"client_id=%s&client_secret=%s&code=%s&grant_type=authorization_code&redirect_uri=%s",
		config.ClientID, config.ClientSecret, authCode, config.RedirectURI,
	)

	req, err := http.NewRequest("POST", config.TokenURL, strings.NewReader(data))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to exchange auth code: %s", resp.Status)
	}

	var tokenRes TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenRes); err != nil {
		return nil, err
	}

	tokenRes.ExpiresAt = time.Now().Add(time.Duration(tokenRes.ExpiresIn) * time.Second)
	return &tokenRes, nil
}

// Refresh an expired access token
func RefreshOAuthToken(provider string, refreshToken string) (*TokenResponse, error) {
	config, exists := providers[provider]
	if !exists {
		return nil, errors.New("unsupported provider")
	}

	data := fmt.Sprintf(
		"client_id=%s&client_secret=%s&refresh_token=%s&grant_type=refresh_token",
		config.ClientID, config.ClientSecret, refreshToken,
	)

	req, err := http.NewRequest("POST", config.TokenURL, strings.NewReader(data))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to refresh token: %s", resp.Status)
	}

	var tokenRes TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenRes); err != nil {
		return nil, err
	}

	tokenRes.ExpiresAt = time.Now().Add(time.Duration(tokenRes.ExpiresIn) * time.Second)
	return &tokenRes, nil
}

func startTokenRefreshWorker(db *sql.DB) {
	ticker := time.NewTicker(1 * time.Minute)
	go func() {
		defer ticker.Stop()
		for {
			<-ticker.C
			log.Println("Refreshing all expired tokens...")
			refreshAllExpiredTokens(db)
		}
	}()
}

func refreshAllExpiredTokens(db *sql.DB) {
	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()

	rows, err := db.QueryContext(ctx, `
		SELECT user_id, provider, refresh_token
		FROM oauth_tokens
		WHERE expires_at < NOW()
	`)
	
	if err != nil {
		log.Printf("Error querying expired tokens: %v", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var userID string
		var provider string
		var refreshToken string

		if err := rows.Scan(&userID, &provider, &refreshToken); err != nil {
			log.Printf("Error scanning token row: %v", err)
			continue
		}

		tokenData, err := RefreshOAuthToken(provider, refreshToken)

		if err != nil {
			log.Printf("Error refreshing token for user %s: %v", userID, err)
			continue
		}

		_, err = db.ExecContext(ctx, `
			UPDATE oauth_tokens
			SET access_token = $1, refresh_token = $2, expires_at = $3, updated_at = NOW()
			WHERE user_id = $4 AND provider = $5
		`, tokenData.AccessToken, tokenData.RefreshToken, tokenData.ExpiresAt, userID, provider)
		
		if err != nil {
			log.Printf("Error updating token for user %s: %v", userID, err)
			continue
		}

		log.Printf("Successfully refreshed token for user %s", userID)
	}
	
}

func enumToString(provider pb.Provider) (string, error) {
	switch provider {
	case pb.Provider_GOOGLE:
		return "GOOGLE", nil
	case pb.Provider_MICROSOFT:
		return "MICROSOFT", nil
	case pb.Provider_NOTION:
		return "NOTION", nil
	default:
		return "", fmt.Errorf("invalid provider: %v", provider)
	}
}

func (s *integrationServer) ConnectIntegration(ctx context.Context, req *pb.ConnectIntegrationRequest) (*pb.ConnectIntegrationResponse, error) {
	providerStr, err := enumToString(req.Provider)
	if err != nil {
		return &pb.ConnectIntegrationResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to convert provider to string: %v", err),
			ErrorDetails: err.Error(),
		}, nil
	}
	
	tokenRes, err := ExchangeAuthCodeForToken(providerStr, req.AuthCode)
	if err != nil {
		return &pb.ConnectIntegrationResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to exchange auth code: %v", err),
			ErrorDetails: err.Error(),
		}, nil
	}
	
	_, err = s.db.ExecContext(ctx, `
	INSERT INTO oauth_tokens (user_id, provider, access_token, refresh_token, expires_at)
	VALUES ($1, $2, $3, $4, $5)
	ON CONFLICT (user_id, provider)
	DO UPDATE SET
		access_token = EXCLUDED.access_token,
		refresh_token = EXCLUDED.refresh_token,
		expires_at = EXCLUDED.expires_at,
		updated_at = NOW()
	`,
		req.UserId,
		providerStr,
		tokenRes.AccessToken,
		tokenRes.RefreshToken,
		tokenRes.ExpiresAt,
	)

	if err != nil {
		return &pb.ConnectIntegrationResponse{
			Success: false,
			Message: fmt.Sprintf("Database error saving token: %v", err),
			ErrorDetails: err.Error(),
		}, nil
	}

	return &pb.ConnectIntegrationResponse{
		Success: true,
		Message: "Integration connected successfully",
	}, nil
}

func (s *integrationServer) DisconnectIntegration(ctx context.Context, req *pb.DisconnectIntegrationRequest) (*pb.DisconnectIntegrationResponse, error) {
	providerStr, err := enumToString(req.Provider)
	if err != nil {
		return &pb.DisconnectIntegrationResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to convert provider to string: %v", err),
		}, nil
	}

	result, err := s.db.ExecContext(ctx, `
	DELETE FROM oauth_tokens
	WHERE user_id = $1 AND provider = $2
	`,
		req.UserId,
		providerStr,
	)

	if err != nil {
		return &pb.DisconnectIntegrationResponse{
			Success: false,
			Message: fmt.Sprintf("Database error deleting token: %v", err),
		}, nil
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return &pb.DisconnectIntegrationResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to get rows affected: %v", err),
		}, nil
	}

	if rowsAffected == 0 {
		return &pb.DisconnectIntegrationResponse{
			Success: false,
			Message: "No token found to delete",
		}, nil
	}

	return &pb.DisconnectIntegrationResponse{
		Success: true,
		Message: "Integration disconnected successfully",
	}, nil
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
		ALTER TABLE oauth_tokens
		ADD CONSTRAINT user_provider_unique
		UNIQUE (user_id, provider);
	`)

	if err != nil {
		log.Fatalf("Failed to create user_provider index: %v", err)
	}

    fmt.Println("Database setup completed: oauth_tokens table is ready.")
	startTokenRefreshWorker(db)
    
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