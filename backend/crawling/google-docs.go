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

// WordInfo stores word position information efficiently
type WordInfo struct {
	ParaIndex  int
	ParaOffset int
	Word       string
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

	chunks, err := dp.ChunkDocument(doc, metadata)
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

	startPara, startOffset, endPara, endOffset, err := dp.ParseDocsChunkID(metadata.ChunkID)
	if err != nil {
		return TextChunkMessage{}, err
	}

	chunkWords, err := dp.ExtractDocsChunk(doc, startPara, startOffset, endPara, endOffset)
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
func (dp *DocProcessor) ChunkDocument(doc *docs.Document, baseMetadata Metadata) ([]TextChunkMessage, error) {
	var chunks []TextChunkMessage
	chunkNumber := uint64(1)

	wordInfoList := make([]WordInfo, 0, 5000)
	for paraIndex, elem := range doc.Body.Content {
		if elem.Paragraph == nil {
			continue
		}

		paraOffset := 0
		for _, textElem := range elem.Paragraph.Elements {
			if textElem.TextRun == nil {
				continue
			}

			content := strings.NewReplacer("\n", " ", "\r", " ").Replace(textElem.TextRun.Content)
			words := strings.Fields(content)

			for _, word := range words {
				wordInfoList = append(wordInfoList, WordInfo{
					ParaIndex:  paraIndex,
					ParaOffset: paraOffset,
					Word:       word,
				})
				paraOffset += len(word) + 1
			}
		}
	}

	totalWords := len(wordInfoList)
	for startIndex := 0; startIndex < totalWords; startIndex += int(dp.baseChunkSize) - int(dp.baseOverlapSize) {

		endIndex := startIndex + int(dp.baseChunkSize)

		if endIndex > totalWords {
			endIndex = totalWords
		}

		if startIndex > 0 && endIndex-startIndex < int(dp.baseOverlapSize) {
			continue
		}

		chunkWords := make([]string, endIndex-startIndex)
		for i := 0; i < endIndex-startIndex; i++ {
			chunkWords[i] = wordInfoList[startIndex+i].Word
		}

		startInfo := wordInfoList[startIndex]
		endInfo := wordInfoList[endIndex-1]
		endOffset := endInfo.ParaOffset + len(endInfo.Word)

		chunk, err := dp.createDocsChunk(chunkWords, baseMetadata, chunkNumber, startInfo.ParaIndex, startInfo.ParaOffset, endInfo.ParaIndex, endOffset)
		if err != nil {
			return nil, err
		}
		chunks = append(chunks, chunk)

		chunkNumber++
	}
	return chunks, nil
}

// createChunk constructs a TextChunkMessage with metadata
func (dp *DocProcessor) createDocsChunk(words []string, baseMetadata Metadata, chunkNumber uint64, startPara, startOffset, endPara, endOffset int) (TextChunkMessage, error) {
	chunkMetadata := baseMetadata
	chunkMetadata.ChunkNumber = chunkNumber
	chunkMetadata.ChunkSize = uint64(len(words))
	chunkMetadata.ChunkID = fmt.Sprintf("StartParagraph:%d-StartOffset:%d-EndParagraph:%d-EndOffset:%d", startPara, startOffset, endPara, endOffset)

	return TextChunkMessage{
		Metadata: chunkMetadata,
		Content:  strings.Join(words, " "),
	}, nil
}

// parseChunkID extracts chunk boundaries from the ChunkID string
func (dp *DocProcessor) ParseDocsChunkID(chunkID string) (startPara, startOffset, endPara, endOffset int, err error) {
	_, err = fmt.Sscanf(chunkID, "StartParagraph:%d-StartOffset:%d-EndParagraph:%d-EndOffset:%d", &startPara, &startOffset, &endPara, &endOffset)
	if err != nil {
		return 0, 0, 0, 0, fmt.Errorf("invalid ChunkID format: %w", err)
	}
	return startPara, startOffset, endPara, endOffset, nil
}

func (dp *DocProcessor) ExtractDocsChunk(doc *docs.Document, startPara, startOffset, endPara, endOffset int) ([]string, error) {
	var chunkWords []string

	paraMap := make(map[int]*docs.StructuralElement, len(doc.Body.Content))
	for index, elem := range doc.Body.Content {
		if elem.Paragraph != nil {
			paraMap[index] = elem
		}
	}

	for paraIndex := startPara; paraIndex <= endPara; paraIndex++ {
		elem, exists := paraMap[paraIndex]
		if !exists {
			continue
		}

		paraWords := make([]string, 0, 100)
		paraOffsets := make([]int, 0, 100)

		paraOffset := 0
		for _, textElem := range elem.Paragraph.Elements {
			if textElem.TextRun == nil {
				continue
			}

			content := strings.NewReplacer("\n", " ", "\r", " ").Replace(textElem.TextRun.Content)
			words := strings.Fields(content)

			for _, word := range words {
				paraWords = append(paraWords, word)
				paraOffsets = append(paraOffsets, paraOffset)
				paraOffset += len(word) + 1
			}
		}

		for i, offset := range paraOffsets {
			if i >= len(paraWords) {
				break
			}
			inChunk := false
			if paraIndex == startPara && paraIndex == endPara {
				inChunk = offset >= startOffset && offset < endOffset
			} else if paraIndex == startPara {
				inChunk = offset >= startOffset
			} else if paraIndex == endPara {
				inChunk = offset < endOffset
			} else {
				inChunk = true
			}

			if inChunk {
				chunkWords = append(chunkWords, paraWords[i])
			}
		}
	}

	if len(chunkWords) == 0 {
		return nil, fmt.Errorf("no content found for chunk boundary StartParagraph:%d-StartOffset:%d-EndParagraph:%d-EndOffset:%d",
			startPara, startOffset, endPara, endOffset)
	}

	return chunkWords, nil
}

// ProcessGoogleDoc is used to process a Google Doc
func ProcessGoogleDoc(ctx context.Context, client *http.Client, file File) (File, error) {
	processor, err := NewDocProcessor(ctx, client, rateLimiter)
	if err != nil {
		return file, err
	}

	return processor.DocsProcess(ctx, file)
}

// RetrieveGoogleDoc is used to retrieve a chunk of a Google Doc
func RetrieveGoogleDoc(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	processor, err := NewDocProcessor(ctx, client, rateLimiter)
	if err != nil {
		return TextChunkMessage{}, err
	}
	return processor.DocsRetrieve(ctx, metadata)
}
