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

// MimeHandlers maps MIME types to their processing functions
var mimeHandlers = map[string]func(context.Context, *http.Client, File) (File, error){
	"application/vnd.google-apps.document":     ProcessGoogleDoc,
	"application/vnd.google-apps.presentation": ProcessGoogleSlides,
}

// CrawlGoogleDrive retrieves and processes files from Google Drive
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
		DO UPDATE SET 
			retrieval_token = EXCLUDED.retrieval_token, 
			updated_at = EXCLUDED.updated_at, 
			requires_update = EXCLUDED.requires_update
	`, userID, "GOOGLE", "GOOGLE_DRIVE", retrievalToken, time.Now(), time.Now(), true)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("failed to store change token: %w", err)
	}

	return processedFiles, nil
}

// UpdateCrawlGoogleDrive retrieves and processes changes in Google Drive
func UpdateCrawlGoogleDrive(ctx context.Context, client *http.Client, userID string, changeToken string) (string, ListofFiles, error) {
	filelist, newChangeToken, err := GetGoogleDriveChanges(ctx, client, changeToken, userID)
	if err != nil {
		return "", ListofFiles{}, fmt.Errorf("error retrieving Google Drive changes: %w", err)
	}

	if len(filelist.Files) == 0 {
		return changeToken, ListofFiles{}, nil
	}

	processedFiles, err := ProcessAllGoogleDriveFiles(ctx, client, filelist)
	if err != nil {
		return "", ListofFiles{}, fmt.Errorf("error processing Google Drive files: %w", err)
	}

	return newChangeToken, processedFiles, nil
}

// GetGoogleDriveList retrieves the list of files from Google Drive
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
			if driveFile.MimeType != "application/vnd.google-apps.document" &&
				driveFile.MimeType != "application/vnd.google-apps.presentation" {
				continue
			}

			createdTime := parseTime(driveFile.CreatedTime)
			modifiedTime := parseTime(driveFile.ModifiedTime)

			hierarchy := "/"
			if len(driveFile.Parents) > 0 {
				h, err := getFolderHierarchy(srv, driveFile.Parents)
				if err == nil {
					hierarchy = h
				}
			}

			filePath := buildFilePath(hierarchy, driveFile.Name)

			googleFile := Metadata{
				DateCreated:      createdTime,
				DateLastModified: modifiedTime,
				UserID:           userID,
				ResourceID:       driveFile.Id,
				Title:            driveFile.Name,
				ResourceType:     driveFile.MimeType,
				FileURL:          driveFile.WebViewLink,
				FilePath:         filePath,
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

// GetGoogleDriveChanges retrieves changes in Google Drive files
func GetGoogleDriveChanges(ctx context.Context, client *http.Client, retrievalToken string, userID string) (ListofFiles, string, error) {
	srv, err := drive.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return ListofFiles{}, "", fmt.Errorf("failed to create Google Drive service: %w", err)
	}

	var fileList ListofFiles
	pageToken := retrievalToken
	hasChanges := false

	for {
		changesCall := srv.Changes.List(pageToken).
			Fields("nextPageToken, newStartPageToken, changes(fileId, file(id, name, mimeType, createdTime, modifiedTime, webViewLink, trashed, parents))")

		res, err := changesCall.Do()
		if err != nil {
			return ListofFiles{}, "", fmt.Errorf("failed to list changes: %w", err)
		}

		for _, change := range res.Changes {
			if change.File == nil ||
				(change.File.MimeType != "application/vnd.google-apps.document" &&
					change.File.MimeType != "application/vnd.google-apps.presentation") {
				continue
			}

			if change.Removed {
				fileList.Files = append(fileList.Files, createRemovedFileEntry(userID, change.FileId))
				hasChanges = true
				continue
			}

			createdTime := parseTime(change.File.CreatedTime)
			modifiedTime := parseTime(change.File.ModifiedTime)

			hierarchy := "/"
			if len(change.File.Parents) > 0 {
				h, err := getFolderHierarchy(srv, change.File.Parents)
				if err == nil {
					hierarchy = h
				}
			}

			filePath := buildFilePath(hierarchy, change.File.Name)

			exists := !change.File.Trashed && !change.Removed

			googleFile := Metadata{
				DateCreated:      createdTime,
				DateLastModified: modifiedTime,
				UserID:           userID,
				ResourceID:       change.File.Id,
				Title:            change.File.Name,
				ResourceType:     change.File.MimeType,
				FileURL:          change.File.WebViewLink,
				FilePath:         filePath,
				Platform:         "GOOGLE_DRIVE",
				Provider:         "GOOGLE",
				Exists:           exists,
			}

			fileList.Files = append(fileList.Files, File{
				File: []TextChunkMessage{
					{
						Metadata: googleFile,
						Content:  "",
					},
				},
			})
			hasChanges = true
		}

		// Check for more pages or return results
		if res.NextPageToken == "" {
			newToken := res.NewStartPageToken
			if !hasChanges {
				return ListofFiles{}, retrievalToken, nil
			}
			return fileList, newToken, nil
		}
		pageToken = res.NextPageToken
	}
}

// Helper function to parse time with fallback
func parseTime(timeStr string) time.Time {
	parsedTime, err := time.Parse(time.RFC3339, timeStr)
	if err != nil {
		return time.Now()
	}
	return parsedTime
}

// Helper function to build file path
func buildFilePath(hierarchy, fileName string) string {
	filePath := hierarchy
	if hierarchy != "/" {
		filePath += "/"
	}
	return filePath + fileName
}

// Helper function to create removed file entry
func createRemovedFileEntry(userID, fileID string) File {
	return File{
		File: []TextChunkMessage{
			{
				Metadata: Metadata{
					UserID:     userID,
					ResourceID: fileID,
					Platform:   "GOOGLE_DRIVE",
					Provider:   "GOOGLE",
					Exists:     false,
				},
			},
		},
	}
}

// ProcessAllGoogleDriveFiles processes all Google Drive files concurrently
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

// GetStartPageToken retrieves the start page token for Google Drive changes
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

// RetrieveFromDrive retrieves content based on file type
func RetrieveFromDrive(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	switch metadata.ResourceType {
	case "application/vnd.google-apps.document":
		return RetrieveGoogleDoc(ctx, client, metadata)
	case "application/vnd.google-apps.presentation":
		return RetrieveGoogleSlides(ctx, client, metadata)
	default:
		return TextChunkMessage{}, nil
	}
}

// getFolderHierarchy resolves the folder hierarchy for a given file
func getFolderHierarchy(srv *drive.Service, parentIDs []string) (string, error) {
	if len(parentIDs) == 0 {
		return "/", nil
	}

	pathParts := []string{}
	seen := make(map[string]bool)

	currentIDs := parentIDs
	for len(currentIDs) > 0 && !seen[currentIDs[0]] {
		seen[currentIDs[0]] = true
		file, err := srv.Files.Get(currentIDs[0]).
			Fields("name, parents").
			Do()
		if err != nil {
			return "", fmt.Errorf("failed to get folder name: %w", err)
		}

		pathParts = append([]string{file.Name}, pathParts...)
		if len(file.Parents) == 0 {
			break
		}
		currentIDs = file.Parents
	}

	return "/" + strings.Join(pathParts, "/"), nil
}
