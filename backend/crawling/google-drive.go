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
	"application/vnd.google-apps.document": ProcessGoogleDoc,
	//"application/vnd.google-apps.presentation": processGoogleSlide,
	//"application/vnd.google-apps.folder":   processGoogleFolder,
}

// Crawls Google Drive Metadatafiles List
// func CrawlGoogleDrive(ctx context.Context, client *http.Client) error {
// 	filelist, err := GetGoogleDriveList(ctx, client)
// 	if err != nil {
// 		return fmt.Errorf("error retrieving Google Drive file list: %w", err)
// 	}
// 	processedFileList, err := ProcessAllGoogleDriveFiles(ctx, client, filelist)
// 	if err != nil {
// 		return fmt.Errorf("error processing Google Drive files: %w", err)
// 	}
// 	PrintGoogleDriveList(ctx, client, processedFileList)
// 	return nil
// }

// Testing function to see how fast the crawler is
func CrawlGoogleDrive(ctx context.Context, client *http.Client) error {
	var filelist ListofFiles
	err := TimeExecution("GetGoogleDriveList", func() error {
		var innerErr error
		filelist, innerErr = GetGoogleDriveList(ctx, client)
		return innerErr
	})
	if err != nil {
		return fmt.Errorf("error retrieving Google Drive file list: %w", err)
	}

	var processedFileList ListofFiles
	err = TimeExecution("ProcessAllGoogleDriveFiles", func() error {
		var innerErr error
		processedFileList, innerErr = ProcessAllGoogleDriveFiles(ctx, client, filelist)
		return innerErr
	})
	if err != nil {
		return fmt.Errorf("error processing Google Drive files: %w", err)
	}

	err = TimeExecution("PrintGoogleDriveList", func() error {
		return PrintGoogleDriveList(ctx, client, processedFileList)
	})
	if err != nil {
		return fmt.Errorf("error printing Google Drive files: %w", err)
	}

	return nil
}

// Return GoogleDriveList
func GetGoogleDriveList(ctx context.Context, client *http.Client) (ListofFiles, error) {
	srv, err := drive.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return ListofFiles{}, fmt.Errorf("failed to create Google Drive service: %w", err)
	}

	var fileList ListofFiles
	pageToken := ""
	const pageSize = 1000

	for {
		if err := rateLimiter.Wait(ctx, "GOOGLE_DRIVE", "a"); err != nil {
			return ListofFiles{}, fmt.Errorf("rate limit wait failed: %w", err)
		}
		listCall := srv.Files.List().
			PageSize(pageSize).
			Fields("nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, webViewLink, parents, trashed)"). //Things to possible include shared, owners
			Q("trashed = false")
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
				UserID:           "a",
				ResourceID:       driveFile.Id,
				Title:            driveFile.Name,
				ResourceType:     driveFile.MimeType,
				ChunkID:          "",
				FileURL:          driveFile.WebViewLink,
				ChunkSize:        0,
				ChunkNumber:      0,
				Hierarchy:        hierarchy,
				Platform:         "GOOGLE_DRIVE",
				Provider:         "GOOGLE",
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
	copy(processedList.Files, fileList.Files)
	var firstErr error

	for res := range resultChan {
		if res.err != nil && firstErr == nil {
			firstErr = res.err
		}
		processedList.Files[res.index] = res.file
	}

	return processedList, firstErr
}

// RetrieveFromDrive goes to specfic retrieval
func RetrieveFromDrive(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	if metadata.ResourceType == "application/vnd.google-apps.document" {
		return RetrieveGoogleDoc(ctx, client, metadata)
	}
	return TextChunkMessage{}, nil
}

func PrintGoogleDriveList(ctx context.Context, client *http.Client, fileList ListofFiles) error {
	for _, file := range fileList.Files {
		if len(file.File) == 0 {
			continue
		}
		if file.File[0].Metadata.ResourceType == "application/vnd.google-apps.document" {
			fmt.Printf("ID: %s\n", file.File[0].Metadata.ResourceID)
			fmt.Printf("Name: %s\n", file.File[0].Metadata.Title)
			fmt.Printf("MIME Type: %s\n", file.File[0].Metadata.ResourceType)
			fmt.Printf("Created Time: %s\n", file.File[0].Metadata.DateCreated.Format(time.RFC3339))
			fmt.Printf("Modified Time: %s\n", file.File[0].Metadata.DateLastModified.Format(time.RFC3339))
			fmt.Printf("Web View Link: %s\n", file.File[0].Metadata.FileURL)
			fmt.Println("-----------------------------------")

			// Print all chunks
			for _, chunk := range file.File {
				fmt.Printf("Chunk ID: %s\n", chunk.Metadata.ChunkID)
				fmt.Printf("Chunk Number: %d\n", chunk.Metadata.ChunkNumber)
				fmt.Printf("Chunk Size: %d\n", chunk.Metadata.ChunkSize)
				fmt.Println("Content:", chunk.Content)
				fmt.Println("-----------------------------------")
			}
		}
	}
	return nil
}
