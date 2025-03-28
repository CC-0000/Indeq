package main

import (
	"context"
	"fmt"
	"net/http"
)

// GoogleCrawler crawls Google services (Drive, Gmail) based on provided scopes.
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

	var errs []error
	for scope, crawler := range crawlers {
		if _, ok := scopeSet[scope]; !ok {
			continue
		}
		if err := ctx.Err(); err != nil {
			return ListofFiles{}, err
		}
		processedFiles, err := crawler(ctx, client, userID)
		if err != nil {
			errs = append(errs, fmt.Errorf("%s crawl failed: %w", scope, err))
			continue
		}
		files.Files = append(files.Files, processedFiles.Files...)
	}
	if len(errs) > 0 {
		return ListofFiles{}, fmt.Errorf("partial failure: %v", errs)
	}
	return files, nil
}

func UpdateCrawlGoogle(ctx context.Context, client *http.Client, service string, userID string, retrievalToken string) (string, ListofFiles, error) {
	if service == "GOOGLE_DRIVE" {
		newRetrievalToken, processedFiles, err := UpdateCrawlGoogleDrive(ctx, client, userID, retrievalToken)
		return newRetrievalToken, processedFiles, err
	}
	if service == "GOOGLE_GMAIL" {
		newRetrievalToken, processedFiles, err := UpdateCrawlGmail(ctx, client, userID, retrievalToken)
		return newRetrievalToken, processedFiles, err
	}
	return "", ListofFiles{}, fmt.Errorf("unsupported service: %s", service)
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
