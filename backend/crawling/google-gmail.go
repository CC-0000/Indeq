package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
)

type CrawlResult struct {
	Files []File
	Err   error
}

func (s *crawlingServer) CrawlGmail(ctx context.Context, client *http.Client, userID string) (ListofFiles, error) {
	result, retrievalToken, err := GetGoogleGmailList(ctx, client, userID)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("error retrieving Google Gmail file list: %w", err)
	}
	_, err = s.db.ExecContext(ctx, `
	INSERT INTO retrievalTokens (user_id, provider, service, retrieval_token, created_at, updated_at, requires_update)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	ON CONFLICT (user_id, service)
	DO UPDATE SET retrieval_token = EXCLUDED.retrieval_token, updated_at = EXCLUDED.updated_at, requires_update = EXCLUDED.requires_update
	`, userID, "GOOGLE", "GOOGLE_GMAIL", retrievalToken, time.Now(), time.Now(), true)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("failed to store change token: %w", err)
	}
	return result, nil
}

func UpdateCrawlGmail(ctx context.Context, client *http.Client, userID string, retrievalToken string) (string, ListofFiles, error) {
	tokenUint64, err := strconv.ParseUint(retrievalToken, 10, 64)
	if err != nil {
		return retrievalToken, ListofFiles{}, err
	}
	result, newRetrievalToken, err := CrawlGmailHistory(ctx, client, userID, tokenUint64)
	return newRetrievalToken, result, err
}

func CrawlGmailHistory(ctx context.Context, client *http.Client, userID string, lastHistoryID uint64) (ListofFiles, string, error) {
	srv, err := gmail.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return ListofFiles{}, "", fmt.Errorf("failed to create Gmail service: %w", err)
	}

	var files []File
	var latestHistoryID = lastHistoryID
	historyCall := srv.Users.History.List("me").
		StartHistoryId(lastHistoryID).
		Fields("history(messagesAdded,messagesDeleted,labelsAdded,labelsRemoved),nextPageToken")

	pageToken := ""
	for {
		if pageToken != "" {
			historyCall.PageToken(pageToken)
		}

		if err := rateLimiter.Wait(ctx, "GOOGLE_GMAIL", userID); err != nil {
			return ListofFiles{}, "", err
		}

		res, err := historyCall.Do()
		if err != nil {
			return ListofFiles{}, "", fmt.Errorf("failed to fetch Gmail history: %w", err)
		}

		for _, history := range res.History {
			if len(history.MessagesAdded) > 0 {
				for _, msg := range history.MessagesAdded {
					fullMsg, err := srv.Users.Messages.Get("me", msg.Message.Id).
						Fields("id,internalDate,payload(headers,body/data,parts),historyId").
						Do()
					if err != nil {
						continue
					}
					file, err := processMessage(fullMsg, userID)
					if err == nil {
						files = append(files, file)
						if fullMsg.HistoryId > latestHistoryID {
							latestHistoryID = fullMsg.HistoryId
						}
					}
				}
			}
		}

		if res.NextPageToken == "" {
			break
		}
		pageToken = res.NextPageToken
	}
	retrievalToken := strconv.FormatUint(latestHistoryID, 10)

	return ListofFiles{Files: files}, retrievalToken, nil
}

func GetGoogleGmailList(ctx context.Context, client *http.Client, userID string) (ListofFiles, string, error) {
	srv, err := gmail.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return ListofFiles{}, "", fmt.Errorf("failed to create Gmail service: %w", err)
	}

	const pageSize = 1000
	const workers = 10

	var files []File
	var mu sync.Mutex
	var latestHistoryID uint64

	pageToken := ""
	workerChan := make(chan *gmail.Message, workers*10)
	var wg sync.WaitGroup

	// Worker pool
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for msg := range workerChan {
				file, err := processMessage(msg, userID)
				if err != nil {
					log.Printf("failed to process message: %v", err)
					continue
				}
				mu.Lock()
				files = append(files, file)
				if msg.HistoryId > latestHistoryID {
					latestHistoryID = msg.HistoryId
				}
				mu.Unlock()
			}
		}()
	}

	for {
		if err := rateLimiter.Wait(ctx, "GOOGLE_GMAIL", "a"); err != nil {
			log.Printf("rate limiter error: %v", err)
			break
		}

		call := srv.Users.Messages.List("me").
			Q("in:sent OR category:primary").
			PageToken(pageToken).
			MaxResults(pageSize).
			Fields("messages(id),nextPageToken")

		res, err := call.Do()
		if err != nil {
			log.Printf("failed to list messages: %v", err)
			break
		}

		for _, msg := range res.Messages {
			fullMsg, err := srv.Users.Messages.Get("me", msg.Id).
				Fields("id,internalDate,historyId,payload(headers,body/data,parts)").
				Do()
			if err != nil {
				log.Printf("failed to fetch message %s: %v", msg.Id, err)
				continue
			}
			workerChan <- fullMsg
		}

		if res.NextPageToken == "" {
			break
		}
		pageToken = res.NextPageToken
	}

	close(workerChan)
	wg.Wait()

	retrievalToken := strconv.FormatUint(latestHistoryID, 10)
	return ListofFiles{Files: files}, retrievalToken, nil
}

// processMessage processes a single email message
func processMessage(fullMsg *gmail.Message, userID string) (File, error) {
	var subject, from string
	for _, header := range fullMsg.Payload.Headers {
		switch header.Name {
		case "Subject":
			subject = header.Value
		case "From":
			from = header.Value
		}
	}

	var bodyContent string
	if fullMsg.Payload.Body != nil && fullMsg.Payload.Body.Data != "" {
		bodyContent = decodeBase64Url(fullMsg.Payload.Body.Data)
	} else {
		bodyContent = extractBodyFromParts(fullMsg.Payload.Parts)
	}

	createdTime := time.UnixMilli(fullMsg.InternalDate)
	metadata := Metadata{
		DateCreated:      createdTime,
		DateLastModified: createdTime,
		UserID:           userID,
		ResourceID:       fullMsg.Id,
		Title:            from + " : " + subject,
		ResourceType:     "gmail/message",
		ChunkID:          "",
		ChunkSize:        0,
		ChunkNumber:      0,
		FileURL:          "https://mail.google.com/mail/u/0/#inbox/" + fullMsg.Id,
		FilePath:         "",
		Platform:         "GOOGLE_GMAIL",
		Provider:         "GOOGLE",
	}

	return File{File: []TextChunkMessage{{
		Metadata: metadata,
		Content:  bodyContent,
	}}}, nil
}

// Decode base64url encoded data
func decodeBase64Url(encoded string) string {
	decoded, err := base64.URLEncoding.DecodeString(encoded)
	if err != nil {
		fmt.Println("Failed to decode base64url:", err)
		return ""
	}
	return string(decoded)
}

// Extract body content from the message parts
func extractBodyFromParts(parts []*gmail.MessagePart) string {
	for _, part := range parts {
		if part.MimeType == "text/plain" && part.Body != nil && part.Body.Data != "" {
			return decodeBase64Url(part.Body.Data)
		}
		if part.MimeType == "text/html" && part.Body != nil && part.Body.Data != "" {
			return decodeBase64Url(part.Body.Data)
		}
	}
	return ""
}

// New function to retrieve a specific email by resource ID
func RetrieveFromGmail(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	srv, err := gmail.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return TextChunkMessage{}, fmt.Errorf("failed to create Gmail service: %w", err)
	}

	fullMsg, err := srv.Users.Messages.Get("me", metadata.ResourceID).
		Fields("id,internalDate,payload(headers,body/data,parts)").
		Do()
	if err != nil {
		return TextChunkMessage{}, fmt.Errorf("failed to retrieve email with ID %s: %w", metadata.ResourceID, err)
	}

	file, err := processMessage(fullMsg, metadata.UserID)
	if err != nil {
		return TextChunkMessage{}, err
	}

	if len(file.File) == 0 {
		return TextChunkMessage{}, fmt.Errorf("no content found for email with ID %s", metadata.ResourceID)
	}

	return file.File[0], nil
}
