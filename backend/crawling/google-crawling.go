package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"

	pb "github.com/cc-0000/indeq/common/api"
)

// GoogleCrawler crawls Google services (Drive, Gmail) based on provided scopes.
func (s *crawlingServer) GoogleCrawler(ctx context.Context, client *http.Client, userID string, scopes []string) (ListofFiles, error) {
	var files ListofFiles
	var mu sync.Mutex
	scopeSet := make(map[string]struct{}, len(scopes))
	log.Printf("GoogleCrawler started for user %s with %d scopes", userID, len(scopes))

	for _, scope := range scopes {
		scopeSet[scope] = struct{}{}
	}
	log.Printf("Scope set created with %d entries", len(scopeSet))

	crawlers := map[string]func(context.Context, *http.Client, string) (ListofFiles, error){
		"https://www.googleapis.com/auth/drive.readonly": s.CrawlGoogleDrive,
		"https://www.googleapis.com/auth/gmail.readonly": s.CrawlGmail,
	}

	var wg sync.WaitGroup
	errs := make(chan error, len(crawlers))
	results := make(chan string, len(crawlers))
	activeCrawlers := 0
	for scope, crawler := range crawlers {
		if _, ok := scopeSet[scope]; !ok {
			log.Printf("Skipping crawler for scope %s - not in user's scope set", scope)
			continue
		}
		activeCrawlers++
		wg.Add(1)
		go func(scope string, crawler func(context.Context, *http.Client, string) (ListofFiles, error)) {
			defer wg.Done()

			select {
			case <-ctx.Done():
				log.Printf("Context cancelled for scope %s", scope)
				errs <- ctx.Err()
				return
			default:
				processedFiles, err := crawler(ctx, client, userID)
				if err != nil {
					errs <- fmt.Errorf("%s crawl failed: %w", scope, err)
					return
				}
				log.Printf("Successfully processed %d files for scope %s", len(processedFiles.Files), scope)

				mu.Lock()
				files.Files = append(files.Files, processedFiles.Files...)
				mu.Unlock()
				results <- scope
			}
		}(scope, crawler)
	}

	go func() {
		wg.Wait()
		close(errs)
		close(results)
	}()

	completedCrawlers := make(map[string]bool)
	for scope := range results {
		completedCrawlers[scope] = true
		log.Printf("Crawler completed for scope: %s (%d/%d complete)", scope, len(completedCrawlers), activeCrawlers)
	}

	var errorList []error
	for err := range errs {
		if err != nil {
			log.Printf("Received error from crawler: %v", err)
			errorList = append(errorList, err)
		}
	}

	if activeCrawlers > 0 && len(completedCrawlers) == activeCrawlers {
		s.markCrawlingComplete(userID)
		if err := s.sendCrawlDoneSignal(ctx, userID, "GOOGLE"); err != nil {
			log.Printf("Failed to send crawl done signal for Google services: %v", err)
		}
	}

	if len(errorList) > 0 {
		return ListofFiles{}, fmt.Errorf("partial failure: %v", errorList)
	}
	return files, nil
}

// UpdateCrawlGoogle goes through specific service and return the new retrieval token and processed files
func (s *crawlingServer) UpdateCrawlGoogle(ctx context.Context, client *http.Client, service string, userID string, retrievalToken string) (string, ListofFiles, error) {
	var newRetrievalToken string
	var processedFiles ListofFiles
	var err error

	switch service {
	case "GOOGLE_DRIVE":
		newRetrievalToken, processedFiles, err = s.UpdateCrawlGoogleDrive(ctx, client, userID, retrievalToken)
	case "GOOGLE_GMAIL":
		newRetrievalToken, processedFiles, err = s.UpdateCrawlGmail(ctx, client, userID, retrievalToken)
	default:
		return "", ListofFiles{}, fmt.Errorf("unsupported service: %s", service)
	}

	if err != nil {
		return "", ListofFiles{}, err
	}

	if err := s.sendCrawlDoneSignal(ctx, userID, "GOOGLE"); err != nil {
		log.Printf("Failed to send crawl done signal for Google %s update: %v", service, err)
	}

	return newRetrievalToken, processedFiles, nil
}

// GetChunksFromGoogle retrieves chunks from Google services based on metadata
func (s *crawlingServer) GetChunksFromGoogle(ctx context.Context, req *pb.GetChunksFromGoogleRequest) (*pb.GetChunksFromGoogleResponse, error) {
	accessToken, err := s.retrieveAccessToken(ctx, req.UserId, "GOOGLE")
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve access token: %w", err)
	}

	client := createGoogleOAuthClient(ctx, accessToken)

	type chunkResult struct {
		chunk *pb.TextChunkMessage
		err   error
	}

	kVal, err := strconv.Atoi(os.Getenv("CRAWLING_K_VAL"))
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve the k value from the env variables: %w", err)
	}
	numWorkers := kVal
	resultChan := make(chan chunkResult, len(req.Metadatas))
	var wg sync.WaitGroup

	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func(start int) {
			defer wg.Done()
			for j := start; j < len(req.Metadatas); j += numWorkers {
				metadata := req.Metadatas[j]
				internalMetadata := Metadata{
					DateCreated:      metadata.DateCreated.AsTime(),
					DateLastModified: metadata.DateLastModified.AsTime(),
					UserID:           metadata.UserId,
					ResourceID:       metadata.FileId,
					ResourceType:     metadata.ResourceType,
					FileURL:          metadata.FileUrl,
					Title:            metadata.Title,
					ChunkID:          metadata.ChunkId,
					FilePath:         metadata.FilePath,
					Platform:         "GOOGLE",
					Service:          metadata.Service,
				}

				chunk, err := RetrieveGoogleCrawler(ctx, client, internalMetadata)
				if err != nil {
					resultChan <- chunkResult{
						err: fmt.Errorf("error retrieving chunk for %s: %w", internalMetadata.FilePath, err),
					}
					continue
				}

				protoChunk := &pb.TextChunkMessage{
					Metadata: s.convertToProtoMetadata(chunk.Metadata),
					Content:  chunk.Content,
				}
				resultChan <- chunkResult{chunk: protoChunk}
			}
		}(i)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	var chunks []*pb.TextChunkMessage
	var errs []error
	for result := range resultChan {
		if result.err != nil {
			errs = append(errs, result.err)
			log.Printf("Warning: %v", result.err)
			continue
		}
		if result.chunk != nil {
			chunks = append(chunks, result.chunk)
		}
	}

	if len(errs) > 0 {
		log.Printf("Some chunks failed to retrieve: %v", errs)
	}

	return &pb.GetChunksFromGoogleResponse{
		NumChunks: int64(len(chunks)),
		Chunks:    chunks,
	}, nil
}

func RetrieveGoogleCrawler(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	if metadata.Service == "GOOGLE_DRIVE" {
		return RetrieveFromDrive(ctx, client, metadata)
	}
	if metadata.Service == "GOOGLE_GMAIL" {
		return RetrieveFromGmail(ctx, client, metadata)
	}

	return TextChunkMessage{}, fmt.Errorf("unsupported service: %s", metadata.Service)
}
