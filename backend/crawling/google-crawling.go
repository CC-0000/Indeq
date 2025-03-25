package main

import (
	"context"
	"log"
	"net/http"
)

// GoogleCrawler crawls Google Drive and Gmail
func (s *crawlingServer) GoogleCrawler(ctx context.Context, client *http.Client, userID string, scopes []string) (ListofFiles, error) {
	var files ListofFiles
	scopeSet := make(map[string]struct{}, len(scopes))
	for _, scope := range scopes {
		scopeSet[scope] = struct{}{}
	}

	crawlers := map[string]func(context.Context, *http.Client, string) (ListofFiles, error){
		"https://www.googleapis.com/auth/drive.readonly": s.CrawlGoogleDrive,
		"https://www.googleapis.com/auth/gmail.readonly": s.CrawlGmail,
	}

	for scope, crawler := range crawlers {
		if _, ok := scopeSet[scope]; ok {
			processedFiles, err := crawler(ctx, client, userID)
			if err != nil {
				log.Printf("%s crawl failed for user %s: %v", scope, userID, err)
				return ListofFiles{}, err
			}
			files.Files = append(files.Files, processedFiles.Files...)
		}
	}
	return files, nil
}

func UpdateCrawlGoogle(ctx context.Context, client *http.Client, service string, userID string, retrievalToken string) (string, ListofFiles, error) {
	newRetrievalToken, processedFiles, err := UpdateCrawlGoogleDrive(ctx, client, userID, retrievalToken)
	return newRetrievalToken, processedFiles, err
}

func RetrieveGoogleCrawler(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	if metadata.Platform == "GOOGLE_DRIVE" {
		return RetrieveFromDrive(ctx, client, metadata)
	}
	if metadata.Platform == "GOOGLE_GMAIL" {
		return RetrieveFromGmail(ctx, client, metadata)
	}
	return TextChunkMessage{}, nil
}
