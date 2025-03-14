package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"google.golang.org/api/docs/v1"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

var mimeHandlers = map[string]func(context.Context, *http.Client, File) (File, error){
	"application/vnd.google-apps.document": processGoogleDoc,
	//"application/vnd.google-apps.folder":   processGoogleFolder,
}

// GoogleCrawler crawls Google services based on provided OAuth scopes.
func GoogleCrawler(ctx context.Context, client *http.Client, scopes []string) error {
	log.Println("Starting Google Crawler")

	// Convert scopes to a set for O(1) lookups
	scopeSet := make(map[string]struct{}, len(scopes))
	for _, scope := range scopes {
		scopeSet[scope] = struct{}{}
	}

	// Define a map of crawl functions to their required scopes
	crawlers := map[string]func(context.Context, *http.Client) error{
		"https://www.googleapis.com/auth/drive.readonly":    CrawlGoogleDrive,
		"https://www.googleapis.com/auth/gmail.readonly":    CrawlGmail,
		"https://www.googleapis.com/auth/calendar.readonly": CrawlGoogleCalendar,
	}

	// Crawl each service that has the required scope
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

// TODO: Crawls Google Drive
func CrawlGoogleDrive(ctx context.Context, client *http.Client) error {
	PrintGoogleDriveList(ctx, client)
	return nil
}

func GetGoogleDriveList(ctx context.Context, client *http.Client) (ListofFiles, error) {
	srv, err := drive.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return ListofFiles{}, fmt.Errorf("failed to create Google Drive service: %w", err)
	}

	var fileList ListofFiles
	pageToken := ""
	const pageSize = 1000

	for {
		listCall := srv.Files.List().
			PageSize(pageSize).
			Fields("nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, webViewLink, parents, trashed)"). //Things to possible include shared, owners
			// Only include non-trashed files
			Q("trashed = false")
		if pageToken != "" {
			listCall = listCall.PageToken(pageToken)
		}

		res, err := listCall.Do()
		if err != nil {
			return ListofFiles{}, fmt.Errorf("failed to list files: %w", err)
		}
		// Process files in batch rather than individually
		for _, driveFile := range res.Files {
			// Create your GoogleFile directly from the Drive API response
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

func ProcessAllGoogleDriveFiles(ctx context.Context, client *http.Client, fileList ListofFiles) error {
	for i, file := range fileList.Files {
		if len(file.File) == 0 {
			continue
		}

		mimeType := file.File[0].Metadata.ResourceType
		handler, exists := mimeHandlers[mimeType]

		if exists {
			processedFile, err := handler(ctx, client, file)
			if err != nil {
				return fmt.Errorf("failed to process file %s: %w",
					file.File[0].Metadata.ResourceID, err)
			}
			fileList.Files[i] = processedFile
		}
	}
	return nil
}

// Google Docs processor that makes chucks
func processGoogleDoc(ctx context.Context, client *http.Client, file File) (File, error) {
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

func PrintGoogleDriveList(ctx context.Context, client *http.Client) error {
	fileList, err := GetGoogleDriveList(ctx, client)
	ProcessAllGoogleDriveFiles(ctx, client, fileList)
	if err != nil {
		return fmt.Errorf("error retrieving Google Drive file list: %w", err)
	}

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
