package main

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

var mimeHandlers = map[string]func(context.Context, *http.Client, File) (File, error){
	"application/vnd.google-apps.document":     ProcessGoogleDoc,
	"application/vnd.google-apps.presentation": ProcessGoogleSlides,
	//"application/vnd.google-apps.folder":       processGoogleFolder,
}

// Crawls Google Drive Metadatafiles List
func (s *crawlingServer) CrawlGoogleDrive(ctx context.Context, client *http.Client, userID string) (ListofFiles, error) {
	filelist, err := GetGoogleDriveList(ctx, client, userID)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("error retrieving Google Drive file list: %w", err)
	}
	processedFiles, err := ProcessAllGoogleDriveFiles(ctx, client, filelist)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("error processing Google Drive files: %w", err)
	}
	retrievalToken, err := GetStartPageToken(ctx, client)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("error getting start page token: %w", err)
	}

	_, err = s.db.ExecContext(ctx, `
	INSERT INTO retrievalTokens (user_id, provider, service, retrieval_token, created_at, updated_at, requires_update)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	ON CONFLICT (user_id, service)
	DO UPDATE SET retrieval_token = EXCLUDED.retrieval_token, updated_at = EXCLUDED.updated_at, requires_update = EXCLUDED.requires_update
	`, userID, "GOOGLE", "GOOGLE_DRIVE", retrievalToken, time.Now(), time.Now(), true)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("failed to store change token: %w", err)
	}

	return processedFiles, nil
}

// UpdateCrawlGoogleDrive crawls Google Drive files periodically
func UpdateCrawlGoogleDrive(ctx context.Context, client *http.Client, userID string, changeToken string) (string, ListofFiles, error) {
	filelist, newChangeToken, err := GetGoogleDriveChanges(ctx, client, changeToken, userID)
	if err != nil {
		return "", ListofFiles{}, fmt.Errorf("error retrieving Google Drive changes: %w", err)
	}
	processedFiles, err := ProcessAllGoogleDriveFiles(ctx, client, filelist)
	if err != nil {
		return "", ListofFiles{}, fmt.Errorf("error processing Google Drive files: %w", err)
	}
	return newChangeToken, processedFiles, nil
}

// Return GoogleDriveList
func GetGoogleDriveList(ctx context.Context, client *http.Client, userID string) (ListofFiles, error) {
	srv, err := drive.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return ListofFiles{}, fmt.Errorf("failed to create Google Drive service: %w", err)
	}

	var fileList ListofFiles
	pageToken := ""
	const pageSize = 1000

	for {
		if err := rateLimiter.Wait(ctx, "GOOGLE_DRIVE", userID); err != nil {
			return ListofFiles{}, fmt.Errorf("rate limit wait failed: %w", err)
		}
		listCall := srv.Files.List().
			PageSize(pageSize).
			Fields("nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, webViewLink, parents, trashed)")
		if pageToken != "" {
			listCall = listCall.PageToken(pageToken)
		}

		res, err := listCall.Do()
		if err != nil {
			return ListofFiles{}, fmt.Errorf("failed to list files: %w", err)
		}

		for _, driveFile := range res.Files {
			createdTime, err := time.Parse(time.RFC3339, driveFile.CreatedTime)
			if err != nil {
				createdTime = time.Now()
			}

			modifiedTime, err := time.Parse(time.RFC3339, driveFile.ModifiedTime)
			if err != nil {
				modifiedTime = time.Now()
			}

			hierarchy := ""
			if len(driveFile.Parents) > 0 {
				hierarchy = strings.Join(driveFile.Parents, "/")
			}

			googleFile := Metadata{
				DateCreated:      createdTime,
				DateLastModified: modifiedTime,
				UserID:           userID,
				ResourceID:       driveFile.Id,
				Title:            driveFile.Name,
				ResourceType:     driveFile.MimeType,
				ChunkID:          "",
				FileURL:          driveFile.WebViewLink,
				ChunkSize:        0,
				ChunkNumber:      0,
				FilePath:         hierarchy,
				Platform:         "GOOGLE_DRIVE",
				Provider:         "GOOGLE",
				Exists:           true,
			}

			fileList.Files = append(fileList.Files, File{
				File: []TextChunkMessage{
					{
						Metadata: googleFile,
						Content:  "",
					},
				},
			})
		}

		if res.NextPageToken == "" {
			break
		}
		pageToken = res.NextPageToken
	}

	return fileList, nil
}

func GetGoogleDriveChanges(ctx context.Context, client *http.Client, retrievalToken string, userID string) (ListofFiles, string, error) {
	srv, err := drive.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return ListofFiles{}, "", fmt.Errorf("failed to create Google Drive service: %w", err)
	}
	var fileList ListofFiles
	pageToken := retrievalToken
	for {
		var exist bool
		changesCall := srv.Changes.List(pageToken).
			Fields("nextPageToken, newStartPageToken, changes(fileId, file(id, name, mimeType, createdTime, modifiedTime, webViewLink, trashed))")

		res, err := changesCall.Do()
		if err != nil {
			return ListofFiles{}, "", fmt.Errorf("failed to list changes: %w", err)
		}
		exist = true

		for _, change := range res.Changes {

			if change.File == nil {
				if change.Removed {
					googleFile := Metadata{
						UserID:     userID,
						ResourceID: change.FileId,
						Platform:   "GOOGLE_DRIVE",
						Provider:   "GOOGLE",
						Exists:     false,
					}
					fileList.Files = append(fileList.Files, File{
						File: []TextChunkMessage{{Metadata: googleFile}},
					})
				}
				continue
			}

			createdTime, err := time.Parse(time.RFC3339, change.File.CreatedTime)
			if err != nil {
				createdTime = time.Now()
			}

			modifiedTime, err := time.Parse(time.RFC3339, change.File.ModifiedTime)
			if err != nil {
				modifiedTime = time.Now()
			}

			hierarchy := ""
			if len(change.File.Parents) > 0 {
				hierarchy = strings.Join(change.File.Parents, "/")
			}

			if change.File.Trashed || change.Removed {
				exist = false
			}

			googleFile := Metadata{
				DateCreated:      createdTime,
				DateLastModified: modifiedTime,
				UserID:           userID,
				ResourceID:       change.File.Id,
				Title:            change.File.Name,
				ResourceType:     change.File.MimeType,
				ChunkID:          "",
				FileURL:          change.File.WebViewLink,
				ChunkSize:        0,
				ChunkNumber:      0,
				FilePath:         hierarchy,
				Platform:         "GOOGLE_DRIVE",
				Provider:         "GOOGLE",
				Exists:           exist,
			}
			fileList.Files = append(fileList.Files, File{
				File: []TextChunkMessage{
					{
						Metadata: googleFile,
						Content:  "",
					},
				},
			})
		}
		if res.NextPageToken == "" {
			pageToken = res.NewStartPageToken
			return fileList, pageToken, nil
		}
		pageToken = res.NextPageToken
	}
}

// ProcessAllGoogleDriveFiles processes all Google Drive files
func ProcessAllGoogleDriveFiles(ctx context.Context, client *http.Client, fileList ListofFiles) (ListofFiles, error) {
	type result struct {
		index int
		file  File
		err   error
	}

	resultChan := make(chan result, len(fileList.Files))
	var wg sync.WaitGroup

	for i, file := range fileList.Files {
		if len(file.File) == 0 {
			resultChan <- result{i, file, nil}
			continue
		}

		wg.Add(1)
		go func(index int, f File) {
			defer wg.Done()
			mimeType := f.File[0].Metadata.ResourceType
			handler, exists := mimeHandlers[mimeType]
			if !exists {
				resultChan <- result{index, f, nil}
				return
			}
			processedFile, err := handler(ctx, client, f)
			resultChan <- result{index, processedFile, err}
		}(i, file)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	processedList := ListofFiles{
		Files: make([]File, len(fileList.Files)),
	}

	for i, file := range fileList.Files {
		processedList.Files[i] = File{
			File: make([]TextChunkMessage, len(file.File)),
		}
		copy(processedList.Files[i].File, file.File)
	}
	var firstErr error

	for res := range resultChan {
		if res.err != nil && firstErr == nil {
			firstErr = res.err
		}
		processedList.Files[res.index] = res.file
	}
	return processedList, firstErr
}

// GetStartPageToken retrieves the start page token for a specific service and user
func GetStartPageToken(ctx context.Context, client *http.Client) (string, error) {
	srv, err := drive.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return "", fmt.Errorf("failed to create Google Drive service: %w", err)
	}
	changeToken, err := srv.Changes.GetStartPageToken().Do()
	if err != nil {
		return "", fmt.Errorf("unable to retrieve start page token: %v", err)
	}
	return changeToken.StartPageToken, nil
}

// RetrieveFromDrive goes to specfic retrieval
func RetrieveFromDrive(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	if metadata.ResourceType == "application/vnd.google-apps.document" {
		return RetrieveGoogleDoc(ctx, client, metadata)
	}
	if metadata.ResourceType == "application/vnd.google-apps.presentation" {
		return RetrieveGoogleSlides(ctx, client, metadata)
	}
	return TextChunkMessage{}, nil
}
