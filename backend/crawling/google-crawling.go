package main

import (
	"context"
	"log"
	"net/http"
)

// GoogleCrawler crawls Google services based on provided OAuth scopes.
func GoogleCrawler(ctx context.Context, client *http.Client, scopes []string) error {
	scopeSet := make(map[string]struct{}, len(scopes))
	for _, scope := range scopes {
		scopeSet[scope] = struct{}{}
	}

	crawlers := map[string]func(context.Context, *http.Client) error{
		"https://www.googleapis.com/auth/drive.readonly":    CrawlGoogleDrive,
		"https://www.googleapis.com/auth/gmail.readonly":    CrawlGmail,
		"https://www.googleapis.com/auth/calendar.readonly": CrawlGoogleCalendar,
	}

	for scope, crawler := range crawlers {
		if _, ok := scopeSet[scope]; ok {
			err := crawler(ctx, client)
			if err != nil {
				log.Printf("%s crawl failed: %v", scope, err)
				return err
			}
			log.Printf("%s crawl completed", scope)
		} else {
			log.Printf("Skipping %s crawl: scope not provided", scope)
		}
	}

	return nil
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

// TODO: Crawls Google Calendar
func CrawlGoogleCalendar(ctx context.Context, client *http.Client) error {
	return nil
}
