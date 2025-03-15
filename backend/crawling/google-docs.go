package main

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"google.golang.org/api/docs/v1"
	"google.golang.org/api/option"
)

// DocProcessor handles processing and retrieval of Google Docs content
type DocProcessor struct {
	service         *docs.Service
	rateLimiter     *RateLimiterService
	baseChunkSize   uint64
	baseOverlapSize uint64
}

// NewDocProcessor initializes a new DocProcessor with a Google Docs service
func NewDocProcessor(ctx context.Context, client *http.Client, rateLimiter *RateLimiterService) (*DocProcessor, error) {
	srv, err := docs.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return nil, fmt.Errorf("failed to create Docs service: %w", err)
	}
	return &DocProcessor{
		service:         srv,
		rateLimiter:     rateLimiter,
		baseChunkSize:   400,
		baseOverlapSize: 80,
	}, nil
}

// Process chunks a Google Doc into overlapping segments
func (dp *DocProcessor) DocsProcess(ctx context.Context, file File) (File, error) {
	if len(file.File) == 0 {
		return file, nil
	}

	metadata := file.File[0].Metadata
	if err := dp.DocsValidate(ctx, metadata.UserID); err != nil {
		return file, err
	}

	doc, err := dp.DocsFetchDocument(ctx, metadata.ResourceID)
	if err != nil {
		return file, err
	}

	chunks, err := dp.chunkDocument(doc, metadata)
	if err != nil {
		return file, err
	}

	return File{File: chunks}, nil
}

// Retrieve fetches a specific chunk from a Google Doc based on its ChunkID
func (dp *DocProcessor) DocsRetrieve(ctx context.Context, metadata Metadata) (TextChunkMessage, error) {
	if err := dp.DocsValidate(ctx, metadata.UserID); err != nil {
		return TextChunkMessage{}, err
	}

	doc, err := dp.DocsFetchDocument(ctx, metadata.ResourceID)
	if err != nil {
		return TextChunkMessage{}, err
	}

	startPara, startOffset, endPara, endOffset, err := dp.parseDocsChunkID(metadata.ChunkID)
	if err != nil {
		return TextChunkMessage{}, err
	}

	chunkWords, err := dp.extractDocsChunk(doc, startPara, startOffset, endPara, endOffset)
	if err != nil {
		return TextChunkMessage{}, err
	}

	return TextChunkMessage{
		Metadata: metadata,
		Content:  strings.Join(chunkWords, " "),
	}, nil
}

// validate ensures the userID is present and respects rate limits
func (dp *DocProcessor) DocsValidate(ctx context.Context, userID string) error {
	if userID == "" {
		return fmt.Errorf("userID required for per-user rate limiting")
	}
	if err := dp.rateLimiter.Wait(ctx, "GOOGLE_DOCS", userID); err != nil {
		return fmt.Errorf("rate limit wait failed: %w", err)
	}
	return nil
}

// fetchDocument retrieves a Google Doc by its resource ID
func (dp *DocProcessor) DocsFetchDocument(ctx context.Context, resourceID string) (*docs.Document, error) {
	doc, err := dp.service.Documents.Get(resourceID).Do()
	if err != nil {
		return nil, fmt.Errorf("failed to get document: %w", err)
	}
	return doc, nil
}

// chunkDocument splits a document into overlapping chunks
func (dp *DocProcessor) chunkDocument(doc *docs.Document, baseMetadata Metadata) ([]TextChunkMessage, error) {
	var chunks []TextChunkMessage
	currentWords := make([]string, 0, dp.baseChunkSize)
	chunkNumber := uint64(1)
	startParaIndex := -1
	startOffset := 0
	currentOffset := 0

	for paraIndex, elem := range doc.Body.Content {
		if elem.Paragraph == nil {
			continue
		}
		if startParaIndex == -1 {
			startParaIndex = paraIndex
			startOffset = 0
		}

		for _, textElem := range elem.Paragraph.Elements {
			if textElem.TextRun == nil {
				continue
			}
			content := strings.NewReplacer("\n", " ", "\r", " ").Replace(textElem.TextRun.Content)
			words := strings.Fields(content)

			for _, word := range words {
				currentWords = append(currentWords, word)
				currentOffset += len(word) + 1 // +1 for space

				if uint64(len(currentWords)) >= dp.baseChunkSize {
					chunk, err := dp.createDocsChunk(currentWords, baseMetadata, chunkNumber, startParaIndex, startOffset, paraIndex, currentOffset)
					if err != nil {
						return nil, err
					}
					chunks = append(chunks, chunk)

					// Prepare next chunk with overlap
					if len(currentWords) > int(dp.baseOverlapSize) {
						currentWords = currentWords[len(currentWords)-int(dp.baseOverlapSize):]
						currentOffset -= (len(strings.Join(currentWords, " ")) + 1)
						startParaIndex = paraIndex
						startOffset = currentOffset
					} else {
						currentWords = currentWords[:0]
						startParaIndex = paraIndex
						startOffset = currentOffset
					}
					chunkNumber++
				}
			}
		}
	}

	// Handle remaining words
	if len(currentWords) > 0 {
		chunk, err := dp.createDocsChunk(currentWords, baseMetadata, chunkNumber, startParaIndex, startOffset, len(doc.Body.Content)-1, currentOffset)
		if err != nil {
			return nil, err
		}
		chunks = append(chunks, chunk)
	}

	return chunks, nil
}

// createChunk constructs a TextChunkMessage with metadata
func (dp *DocProcessor) createDocsChunk(words []string, baseMetadata Metadata, chunkNumber uint64, startPara, startOffset, endPara, endOffset int) (TextChunkMessage, error) {
	chunkMetadata := baseMetadata
	chunkMetadata.ChunkNumber = chunkNumber
	chunkMetadata.ChunkSize = uint64(len(words))
	chunkMetadata.ChunkID = fmt.Sprintf("%d-%d-%d-%d", startPara, startOffset, endPara, endOffset)
	return TextChunkMessage{
		Metadata: chunkMetadata,
		Content:  strings.Join(words, " "),
	}, nil
}

// parseChunkID extracts chunk boundaries from the ChunkID string
func (dp *DocProcessor) parseDocsChunkID(chunkID string) (startPara, startOffset, endPara, endOffset int, err error) {
	_, err = fmt.Sscanf(chunkID, "%d-%d-%d-%d", &startPara, &startOffset, &endPara, &endOffset)
	if err != nil {
		return 0, 0, 0, 0, fmt.Errorf("invalid ChunkID format: %w", err)
	}
	return startPara, startOffset, endPara, endOffset, nil
}

// extractChunk retrieves words for a specific chunk based on paragraph and offset boundaries
func (dp *DocProcessor) extractDocsChunk(doc *docs.Document, startPara, startOffset, endPara, endOffset int) ([]string, error) {
	var chunkWords []string
	currentOffset := 0

	for paraIndex, elem := range doc.Body.Content {
		if paraIndex < startPara || paraIndex > endPara || elem.Paragraph == nil {
			continue
		}

		for _, textElem := range elem.Paragraph.Elements {
			if textElem.TextRun == nil {
				continue
			}
			content := strings.NewReplacer("\n", " ", "\r", " ").Replace(textElem.TextRun.Content)
			words := strings.Fields(content)

			for _, word := range words {
				wordStartOffset := currentOffset
				currentOffset += len(word) + 1
				if (paraIndex == startPara && wordStartOffset >= startOffset) ||
					(paraIndex > startPara && paraIndex < endPara) ||
					(paraIndex == endPara && wordStartOffset < endOffset) {
					chunkWords = append(chunkWords, word)
				}
			}
		}
	}

	if len(chunkWords) == 0 {
		return nil, fmt.Errorf("no content found for chunk %d-%d-%d-%d", startPara, startOffset, endPara, endOffset)
	}
	return chunkWords, nil
}

// ProcessGoogleDoc is a wrapper for compatibility with existing code
func ProcessGoogleDoc(ctx context.Context, client *http.Client, file File) (File, error) {
	processor, err := NewDocProcessor(ctx, client, rateLimiter)
	if err != nil {
		return file, err
	}
	return processor.DocsProcess(ctx, file)
}

// RetrieveGoogleDoc is a wrapper for compatibility with existing code
func RetrieveGoogleDoc(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	processor, err := NewDocProcessor(ctx, client, rateLimiter)
	if err != nil {
		return TextChunkMessage{}, err
	}
	return processor.DocsRetrieve(ctx, metadata)
}
