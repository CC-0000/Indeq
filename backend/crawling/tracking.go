package main

import (
	"context"
	"log"
)

// Check if a file is processed
func (s *crawlingServer) isFileProcessed(userID, resourceID string) bool {
	ctx := context.Background()
	processedFiles, crawlingDone, err := GetProcessingStatus(ctx, s.db, userID)
	if err != nil {
		log.Printf("Error checking file processed status: %v", err)
		return false
	}

	if crawlingDone {
		return false
	}

	return processedFiles[resourceID]
}

// Mark a file as processed
func (s *crawlingServer) markFileProcessed(userID, resourceID string) {
	ctx := context.Background()
	err := UpsertProcessingStatus(ctx, s.db, userID, resourceID, true)
	if err != nil {
		log.Printf("Error marking file as processed: %v", err)
	}
}

// Mark crawling as complete
func (s *crawlingServer) markCrawlingComplete(userID string) {
	ctx := context.Background()
	err := UpdateCrawlingDone(ctx, s.db, userID, true)
	if err != nil {
		log.Printf("Error marking crawling as complete: %v", err)
	}
}
