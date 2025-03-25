package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
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
	result, err := GetGoogleGmailList(ctx, client, userID)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("error retrieving Google Gmail file list: %w", err)
	}
	return result, nil
}

func GetGoogleGmailList(ctx context.Context, client *http.Client, userID string) (ListofFiles, error) {
	srv, err := gmail.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return ListofFiles{}, fmt.Errorf("failed to create Gmail service: %w", err)
	}

	const pageSize = 1000
	const workers = 10

	var files []File
	var mu sync.Mutex
	pageToken := ""

	msgListChan := make(chan *gmail.UsersMessagesListCall)
	go func() {
		defer close(msgListChan)
		for {
			call := srv.Users.Messages.List("me").
				Q("category:primary").
				PageToken(pageToken).
				MaxResults(pageSize).
				Fields("messages(id),nextPageToken")

			if err := rateLimiter.Wait(ctx, "GOOGLE_GMAIL", "a"); err != nil {
				return
			}

			msgListChan <- call

			res, err := call.Do()
			if err != nil {
				return
			}

			if res.NextPageToken == "" {
				break
			}
			pageToken = res.NextPageToken
		}
	}()

	var wg sync.WaitGroup
	workerChan := make(chan *gmail.Message, workers*2)

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for msg := range workerChan {
				file, err := processMessage(msg, userID)
				if err == nil {
					mu.Lock()
					files = append(files, file)
					mu.Unlock()
				}
			}
		}()
	}

	for listCall := range msgListChan {
		res, err := listCall.Do()
		if err != nil {
			continue
		}

		for _, msg := range res.Messages {
			fullMsg, err := srv.Users.Messages.Get("me", msg.Id).
				Fields("id,internalDate,payload(headers,body/data,parts)").
				Do()
			if err == nil {
				workerChan <- fullMsg
			}
		}
	}
	close(workerChan)
	wg.Wait()

	return ListofFiles{Files: files}, nil
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

//TODO: ADD HistoryID to store changes for future use
