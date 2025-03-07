package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"
	"bytes"
    "encoding/json"
	"encoding/base64"
	"errors"
	"net/http"
	"strings"
	"time"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type integrationServer struct {
    pb.UnimplementedIntegrationServiceServer
    db *sql.DB // integration database
}

// TokenResponse represents the OAuth token response from our providers
type TokenResponse struct {
	AccessToken string `json:"access_token"`
	RefreshToken string `json:"refresh_token,omitempty"`
	ExpiresIn int `json:"expires_in"`
	TokenType string `json:"token_type"`
	Scope string `json:"scope"`
	ExpiresAt time.Time `json:"-"`
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
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURI:  os.Getenv("GOOGLE_REDIRECT_URI"),
	},
	"MICROSOFT": {
		TokenURL:     "https://login.microsoftonline.com/common/oauth2/v2.0/token",
		ClientID:     os.Getenv("MICROSOFT_CLIENT_ID"),
		ClientSecret: os.Getenv("MICROSOFT_CLIENT_SECRET"),
		RedirectURI:  os.Getenv("MICROSOFT_REDIRECT_URI"),
	},
	"NOTION": {
		TokenURL:     "https://api.notion.com/v1/oauth/token",
		ClientID:     os.Getenv("NOTION_CLIENT_ID"),
		ClientSecret: os.Getenv("NOTION_CLIENT_SECRET"),
		RedirectURI:  os.Getenv("NOTION_REDIRECT_URI"),
	},
}

// Exchanges an auth code for access & refresh token
func ExchangeAuthCodeForToken(provider string, authCode string) (*TokenResponse, error) {
	config, exists := providers[provider]
	if !exists {
		return nil, fmt.Errorf("unsupported provider: %s", provider)
	}
	log.Printf("Exchanging auth code for token with provider: %s and auth code: %s", provider, authCode)

	var req *http.Request
	var err error

	if provider == "NOTION" {
		authHeader := "Basic " + base64.StdEncoding.EncodeToString(
			[]byte(config.ClientID + ":" + config.ClientSecret))
		
		data := map[string]string{
			"grant_type": "authorization_code",
			"code": authCode,
			"redirect_uri": config.RedirectURI,
		}
		
		jsonData, err := json.Marshal(data)
		if err != nil {
			return nil, err
		}
		
		req, err = http.NewRequest("POST", config.TokenURL, bytes.NewBuffer(jsonData))
		if err != nil {
			return nil, err
		}
		
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", authHeader)
	} else {
		data := fmt.Sprintf(
			"client_id=%s&client_secret=%s&code=%s&grant_type=authorization_code&redirect_uri=%s",
			config.ClientID, config.ClientSecret, authCode, config.RedirectURI,
		)
		req, err = http.NewRequest("POST", config.TokenURL, strings.NewReader(data))
		if err != nil {
			return nil, err
		}
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	}

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
	ticker := time.NewTicker(time.Minute)
	go func() {
		for range ticker.C {
			log.Println("Refreshing all expired tokens...")
			refreshAllExpiredTokens(db)
		}
	}()
}

func refreshAllExpiredTokens(db *sql.DB) {
	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()

	rows, err := db.QueryContext(ctx, `
		SELECT user_id, provider, refresh_token, expires_at
		FROM oauth_tokens
		WHERE expires_at < NOW() + INTERVAL '5 minutes'
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
		var expiresAt time.Time

		if err := rows.Scan(&userID, &provider, &refreshToken, &expiresAt); err != nil {
			log.Printf("Error scanning token row: %v", err)
			continue
		}

		if refreshToken == "" {
			log.Printf("No refresh token found for user %s and provider %s", userID, provider)
			continue
		}

		tokenData, err := RefreshOAuthToken(provider, refreshToken)
		if err != nil {
			log.Printf("Error refreshing token for user %s: %v", userID, err)
			continue
		}

		if tokenData.RefreshToken == "" {
			log.Printf("No new refresh token returned for user %s; reusing old one", userID)
			tokenData.RefreshToken = refreshToken
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

		if tokenData.RefreshToken != refreshToken {
			log.Printf("Successfully refreshed access token and refresh token for user %s", userID)
		} else {
			log.Printf("Successfully refreshed the access token for user %s", userID)
		}
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

func (s *integrationServer) GetIntegrations(ctx context.Context, req *pb.GetIntegrationsRequest) (*pb.GetIntegrationsResponse, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT provider
		FROM oauth_tokens
		WHERE user_id = $1
	`, req.UserId)

	if err != nil {
		return nil, fmt.Errorf("failed to query integrations: %v", err)
	}
	defer rows.Close()

	providersSet := make(map[pb.Provider]bool)
	for rows.Next() {
		var provider string
		if err := rows.Scan(&provider); err != nil {
			return nil, fmt.Errorf("failed to scan provider: %v", err)
		}
		
		switch provider {
		case "GOOGLE":
			providersSet[pb.Provider_GOOGLE] = true
		case "MICROSOFT":
			providersSet[pb.Provider_MICROSOFT] = true
		case "NOTION":
			providersSet[pb.Provider_NOTION] = true
		}
	}

	var providers []pb.Provider
	for provider := range providersSet {
		providers = append(providers, provider)
	}

	return &pb.GetIntegrationsResponse{
		Providers: providers,
	}, nil
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
	var existingRefreshToken string
	err = s.db.QueryRowContext(ctx, `
		SELECT refresh_token
		FROM oauth_tokens
		WHERE user_id = $1 AND provider = $2
	`,
		req.UserId,
		providerStr,
	).Scan(&existingRefreshToken)
	if err != nil && err != sql.ErrNoRows {
		return &pb.ConnectIntegrationResponse{
			Success: false,
			Message: fmt.Sprintf("Database error querying token: %v", err),
			ErrorDetails: err.Error(),
		}, nil
	}

	if tokenRes.RefreshToken == "" {
		if existingRefreshToken != "" {
			log.Println("No refresh token returned from provider, using existing token")
			tokenRes.RefreshToken = existingRefreshToken
		} else {
			return &pb.ConnectIntegrationResponse{
				Success: false,
				Message: "No refresh token returned from provider",
			}, nil
		}
	}
	_, err = s.db.ExecContext(ctx, `
	INSERT INTO oauth_tokens (user_id, provider, access_token, refresh_token, expires_at)
	VALUES ($1, $2, $3, $4, $5)
	ON CONFLICT (user_id, provider)
	DO UPDATE SET
		access_token = EXCLUDED.access_token,
		refresh_token = COALESCE(NULLIF(EXCLUDED.refresh_token, ''), oauth_tokens.refresh_token),
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

    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        log.Fatalf("DATABASE_URL envionment variable is required")
    }

	// Load the TLS configuration values
	tlsConfig, err := config.LoadTLSFromEnv("INTEGRATION_CRT", "INTEGRATION_KEY")
	if err != nil {
		log.Fatal("Error loading TLS config for integration service")
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
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			UNIQUE (user_id, provider)
        );
    `)

    if err != nil {
        log.Fatalf("Failed to create oauth_tokens table: %v", err)
    }

	_, err = db.ExecContext(ctx, `
		CREATE INDEX IF NOT EXISTS user_provider_idx ON oauth_tokens (user_id, provider);
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

    log.Println("Creating the integration server")

	opts := []grpc.ServerOption{
		grpc.Creds(credentials.NewTLS(tlsConfig)),
	}

	grpcServer := grpc.NewServer(opts...)
	pb.RegisterIntegrationServiceServer(grpcServer, &integrationServer{db: db})
    log.Printf("Integration Service listening on %v\n", listener.Addr())
    if err := grpcServer.Serve(listener); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    } else {
        log.Printf("Integration Service served on %v\n", listener.Addr())
    }
}