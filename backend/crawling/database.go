package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

// Platform and service constants
const (
	PlatformGoogle = "GOOGLE"
	ServiceDrive   = "GOOGLE_DRIVE"
	ServiceGmail   = "GOOGLE_GMAIL"
)

// RetrievalToken represents a token entry in the database
type RetrievalToken struct {
	UserID         string
	Platform       string
	Service        string
	RetrievalToken string
	RequiresUpdate bool
}

// Database operations
const (
	// RetrievalToken database operations
	insertRetrievalTokenQuery = `
		INSERT INTO retrievalTokens (
			user_id, platform, service, retrieval_token, 
			created_at, updated_at, requires_update
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (user_id, service)
		DO UPDATE SET 
			retrieval_token = EXCLUDED.retrieval_token,
			updated_at = EXCLUDED.updated_at,
			requires_update = EXCLUDED.requires_update
	`

	deleteRetrievalTokensQuery = `
		DELETE FROM retrievalTokens
		WHERE user_id = $1 AND platform = $2
	`

	getRetrievalTokensQuery = `
		SELECT platform, service, retrieval_token
		FROM retrievalTokens
		WHERE user_id = $1
		FOR UPDATE
	`

	getOutdatedTokensQuery = `
		SELECT user_id, platform, service, retrieval_token
		FROM retrievalTokens
		WHERE updated_at < NOW() - INTERVAL '1 minutes'
		AND requires_update = TRUE
		FOR UPDATE
	`

	// ProcessingStatus database operations

	upsertProcessingStatusQuery = `
		INSERT INTO processing_status (
			user_id, resource_id, is_processed, crawling_done,
			created_at, updated_at
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (user_id, resource_id)
		DO UPDATE SET 
			is_processed = EXCLUDED.is_processed,
			updated_at = EXCLUDED.updated_at
	`

	updateCrawlingDoneQuery = `
		UPDATE processing_status
		SET crawling_done = $2,
			updated_at = $3
		WHERE user_id = $1
	`

	getProcessingStatusQuery = `
		SELECT resource_id, is_processed, crawling_done
		FROM processing_status
		WHERE user_id = $1
	`

	deleteProcessingStatusQuery = `
		DELETE FROM processing_status
		WHERE user_id = $1
	`
)

// StoreGoogleDriveToken stores a Google Drive retrieval token
func StoreGoogleDriveToken(ctx context.Context, db *sql.DB, userID, retrievalToken string) error {
	token := RetrievalToken{
		UserID:         userID,
		Platform:       PlatformGoogle,
		Service:        ServiceDrive,
		RetrievalToken: retrievalToken,
		RequiresUpdate: true,
	}
	return UpsertRetrievalToken(ctx, db, token)
}

// StoreGoogleGmailToken stores a Google Gmail retrieval token
func StoreGoogleGmailToken(ctx context.Context, db *sql.DB, userID, retrievalToken string) error {
	token := RetrievalToken{
		UserID:         userID,
		Platform:       PlatformGoogle,
		Service:        ServiceGmail,
		RetrievalToken: retrievalToken,
		RequiresUpdate: true,
	}
	return UpsertRetrievalToken(ctx, db, token)
}

// UpsertRetrievalToken inserts or updates a retrieval token
func UpsertRetrievalToken(ctx context.Context, db *sql.DB, token RetrievalToken) error {
	now := time.Now()
	_, err := db.ExecContext(ctx, insertRetrievalTokenQuery,
		token.UserID,
		token.Platform,
		token.Service,
		token.RetrievalToken,
		now,
		now,
		token.RequiresUpdate,
	)
	if err != nil {
		return fmt.Errorf("failed to upsert retrieval token: %w", err)
	}
	return nil
}

// DeleteRetrievalTokens deletes all retrieval tokens for a user and platform
func DeleteRetrievalTokens(ctx context.Context, db *sql.DB, userID, platform string) (int64, error) {
	result, err := db.ExecContext(ctx, deleteRetrievalTokensQuery, userID, platform)
	if err != nil {
		return 0, fmt.Errorf("failed to delete retrieval tokens: %w", err)
	}
	return result.RowsAffected()
}

// GetRetrievalTokens gets all retrieval tokens for a user
func GetRetrievalTokens(ctx context.Context, db *sql.DB, userID string) ([]RetrievalToken, error) {
	rows, err := db.QueryContext(ctx, getRetrievalTokensQuery, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query retrieval tokens: %w", err)
	}
	defer rows.Close()

	var tokens []RetrievalToken
	for rows.Next() {
		var token RetrievalToken
		token.UserID = userID
		if err := rows.Scan(&token.Platform, &token.Service, &token.RetrievalToken); err != nil {
			return nil, fmt.Errorf("failed to scan retrieval token: %w", err)
		}
		tokens = append(tokens, token)
	}
	return tokens, rows.Err()
}

// GetOutdatedTokens gets all tokens that need updating
func GetOutdatedTokens(ctx context.Context, db *sql.DB) ([]RetrievalToken, error) {
	rows, err := db.QueryContext(ctx, getOutdatedTokensQuery)
	if err != nil {
		return nil, fmt.Errorf("failed to query outdated tokens: %w", err)
	}
	defer rows.Close()

	var tokens []RetrievalToken
	for rows.Next() {
		var token RetrievalToken
		if err := rows.Scan(
			&token.UserID,
			&token.Platform,
			&token.Service,
			&token.RetrievalToken,
		); err != nil {
			return nil, fmt.Errorf("failed to scan outdated token: %w", err)
		}
		token.RequiresUpdate = true
		tokens = append(tokens, token)
	}
	return tokens, rows.Err()
}

// UpsertProcessingStatus updates or inserts a processing status for a resource
func UpsertProcessingStatus(ctx context.Context, db *sql.DB, userID string, resourceID string, isProcessed bool) error {
	now := time.Now()
	_, err := db.ExecContext(ctx, upsertProcessingStatusQuery,
		userID,
		resourceID,
		isProcessed,
		false,
		now,
		now,
	)
	if err != nil {
		return fmt.Errorf("failed to upsert processing status: %w", err)
	}
	return nil
}

// UpdateCrawlingDone updates the crawling_done status for a user
func UpdateCrawlingDone(ctx context.Context, db *sql.DB, userID string, done bool) error {
	now := time.Now()
	_, err := db.ExecContext(ctx, updateCrawlingDoneQuery,
		userID,
		done,
		now,
	)
	if err != nil {
		return fmt.Errorf("failed to update crawling done status: %w", err)
	}
	return nil
}

// GetProcessingStatus gets the processing status for a user
func GetProcessingStatus(ctx context.Context, db *sql.DB, userID string) (map[string]bool, bool, error) {
	rows, err := db.QueryContext(ctx, getProcessingStatusQuery, userID)
	if err != nil {
		return nil, false, fmt.Errorf("failed to query processing status: %w", err)
	}
	defer rows.Close()

	processedFiles := make(map[string]bool)
	crawlingDone := false

	for rows.Next() {
		var resourceID string
		var isProcessed bool
		if err := rows.Scan(&resourceID, &isProcessed, &crawlingDone); err != nil {
			return nil, false, fmt.Errorf("failed to scan processing status: %w", err)
		}
		processedFiles[resourceID] = isProcessed
	}

	if err = rows.Err(); err != nil {
		return nil, false, fmt.Errorf("error iterating processing status rows: %w", err)
	}

	return processedFiles, crawlingDone, nil
}

// DeleteProcessingStatus deletes all processing status entries for a user
func DeleteProcessingStatus(ctx context.Context, db *sql.DB, userID string) error {
	_, err := db.ExecContext(ctx, deleteProcessingStatusQuery, userID)
	if err != nil {
		return fmt.Errorf("failed to delete processing status: %w", err)
	}
	return nil
}
