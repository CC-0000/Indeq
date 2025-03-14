package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
	"google.golang.org/api/docs/v1"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

var mimeHandlers = map[string]func(context.Context, *http.Client, File) (File, error){
	"application/vnd.google-apps.document": processGoogleDoc,
	//"application/vnd.google-apps.folder":   processGoogleFolder,
}

// GlobalLimiter limits API requests (will need to adjust to redis in future for mutiple instances)
var (
	DriveLimiter = rate.NewLimiter(rate.Every(time.Second/1000), 1000) // 1000 QPS for Drive API (file listing)
	DocsLimiter  = rate.NewLimiter(rate.Every(time.Second/300), 300)   // 300 QPS for Docs API (file processing)
)

// GoogleCrawler crawls Google services based on provided OAuth scopes.
func GoogleCrawler(ctx context.Context, client *http.Client, scopes []string) error {
	log.Println("Starting Google Crawler")

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

	log.Println("Google Crawler Completed")
	return nil
}

// Crawls Google Drive Metadatafiles List
func CrawlGoogleDrive(ctx context.Context, client *http.Client) error {
	filelist, err := GetGoogleDriveList(ctx, client)
	if err != nil {
		return fmt.Errorf("error retrieving Google Drive file list: %w", err)
	}
	processedFileList, err := ProcessAllGoogleDriveFiles(ctx, client, filelist)
	if err != nil {
		return fmt.Errorf("error processing Google Drive files: %w", err)
	}
	PrintGoogleDriveList(ctx, client, processedFileList)
	return nil
}

// Testing function to see how fast the crawler is
// func CrawlGoogleDrive(ctx context.Context, client *http.Client) error {
// 	var filelist ListofFiles
// 	err := TimeExecution("GetGoogleDriveList", func() error {
// 		var innerErr error
// 		filelist, innerErr = GetGoogleDriveList(ctx, client)
// 		return innerErr
// 	})
// 	if err != nil {
// 		return fmt.Errorf("error retrieving Google Drive file list: %w", err)
// 	}

// 	var processedFileList ListofFiles
// 	err = TimeExecution("ProcessAllGoogleDriveFiles", func() error {
// 		var innerErr error
// 		processedFileList, innerErr = ProcessAllGoogleDriveFiles(ctx, client, filelist)
// 		return innerErr
// 	})
// 	if err != nil {
// 		return fmt.Errorf("error processing Google Drive files: %w", err)
// 	}

// 	err = TimeExecution("PrintGoogleDriveList", func() error {
// 		return PrintGoogleDriveList(ctx, client, processedFileList)
// 	})
// 	if err != nil {
// 		return fmt.Errorf("error printing Google Drive files: %w", err)
// 	}

// 	return nil
// }

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
		if err := DriveLimiter.Wait(ctx); err != nil {
			return ListofFiles{}, fmt.Errorf("drive rate limit wait failed: %w", err)
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
			googleFile := Metadata{
				DateCreated:      createdTime,
				DateLastModified: modifiedTime,
				UserID:           "",
				ResourceID:       driveFile.Id,
				Title:            driveFile.Name,
				ResourceType:     driveFile.MimeType,
				ChunkID:          "GOOGLE_DRIVE_",
				FileURL:          driveFile.WebViewLink,
				ChunkSize:        0,
				ChunkNumber:      0,
				//Hierarchy:        driveFile.Parents[0],
				Platform: "GOOGLE_DRIVE",
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

// Google Docs Processer that goes through the document and chunks it
func processGoogleDoc(ctx context.Context, client *http.Client, file File) (File, error) {
	if err := DocsLimiter.Wait(ctx); err != nil {
		return file, fmt.Errorf("docs rate limit wait failed: %w", err)
	}

	srv, err := docs.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return file, fmt.Errorf("failed to create Doc service: %w", err)
	}

	doc, err := srv.Documents.Get(file.File[0].Metadata.ResourceID).Do()
	if err != nil {
		return file, fmt.Errorf("failed to get document: %w", err)
	}

	contentBuilder := strings.Builder{}
	contentBuilder.Grow(len(doc.Body.Content) * 100)

	for _, elem := range doc.Body.Content {
		if elem.Paragraph == nil {
			continue
		}
		for _, textElem := range elem.Paragraph.Elements {
			if textElem.TextRun != nil {
				content := textElem.TextRun.Content
				content = strings.NewReplacer("\n", " ", "\r", " ").Replace(content)
				contentBuilder.WriteString(content)
			}
		}
		contentBuilder.WriteByte(' ')
	}
	file.File[0].Metadata.ChunkID += "docs_"
	content := contentBuilder.String()
	words := strings.Fields(content)
	file.File = ChunkData(words, file.File[0].Metadata)
	return file, nil
}

func PrintGoogleDriveList(ctx context.Context, client *http.Client, fileList ListofFiles) error {
	for _, file := range fileList.Files {
		if len(file.File) == 0 {
			continue
		}
		print(file.File[0].Metadata.ResourceType)
		if file.File[0].Metadata.ResourceType == "application/vnd.google-apps.document" {
			fmt.Printf("ID: %s\n", file.File[0].Metadata.ResourceID)
			fmt.Printf("Name: %s\n", file.File[0].Metadata.Title)
			fmt.Printf("Chunk ID: %s\n", file.File[0].Metadata.ChunkID)
			fmt.Printf("Chunk Size: %d\n", file.File[0].Metadata.ChunkSize)
			fmt.Printf("MIME Type: %s\n", file.File[0].Metadata.ResourceType)
			fmt.Printf("Created Time: %s\n", file.File[0].Metadata.DateCreated.Format(time.RFC3339))
			fmt.Printf("Modified Time: %s\n", file.File[0].Metadata.DateLastModified.Format(time.RFC3339))
			fmt.Printf("Web View Link: %s\n", file.File[0].Metadata.FileURL)
			//fmt.Printf("Parent Folder ID: %s\n", file.Metadata.Hierarchy)
			fmt.Println("file.Content:", file.File[0].Content)
			fmt.Println("-----------------------------------")
		}
	}
	return nil
}

// TODO: Crawls Gmail
func CrawlGmail(ctx context.Context, client *http.Client) error {
	return nil
}

// TODO: Crawls Google Calendar
func CrawlGoogleCalendar(ctx context.Context, client *http.Client) error {
	return nil
}
