package main

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"google.golang.org/api/option"
	"google.golang.org/api/slides/v1"
)

// SlidesProcessor handles processing and retrieval of Google Slides content
type SlidesProcessor struct {
	service         *slides.Service
	rateLimiter     *RateLimiterService
	baseChunkSize   uint64
	baseOverlapSize uint64
}

// SlideWordInfo stores word position information efficiently
type SlideWordInfo struct {
	SlideIndex  int
	SlideOffset int
	Word        string
}

// NewSlidesProcessor initializes a new SlidesProcessor with a Google Slides service
func NewSlidesProcessor(ctx context.Context, client *http.Client, rateLimiter *RateLimiterService) (*SlidesProcessor, error) {
	srv, err := slides.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return nil, fmt.Errorf("failed to create Slides service: %w", err)
	}

	return &SlidesProcessor{
		service:         srv,
		rateLimiter:     rateLimiter,
		baseChunkSize:   400,
		baseOverlapSize: 80,
	}, nil
}

// ProcessGoogleSlides processes a Google Slides presentation
func (sp *SlidesProcessor) SlidesProcess(ctx context.Context, file File) (File, error) {
	if len(file.File) == 0 {
		return file, nil
	}

	metadata := file.File[0].Metadata
	if err := sp.SlidesValidate(ctx, metadata.UserID); err != nil {
		return file, err
	}
	doc, err := sp.SlidesFetchDocument(ctx, metadata.ResourceID)
	if err != nil {
		return file, err
	}
	chunks, err := sp.ChunkPresentation(doc, metadata)
	if err != nil {
		return file, err
	}

	return File{File: chunks}, nil
}

// Retrieve fetches a specific chunk from a Google Slides presentation based on its ChunkID
func (sp *SlidesProcessor) SlidesRetrieve(ctx context.Context, metadata Metadata) (TextChunkMessage, error) {
	if err := sp.SlidesValidate(ctx, metadata.UserID); err != nil {
		return TextChunkMessage{}, err
	}

	doc, err := sp.SlidesFetchDocument(ctx, metadata.ResourceID)
	if err != nil {
		return TextChunkMessage{}, err
	}

	startPara, startOffset, endPara, endOffset, err := sp.ParseSlidesChunkID(metadata.ChunkID)
	if err != nil {
		return TextChunkMessage{}, err
	}

	chunkWords, err := sp.ExtractSlidesChunk(doc, startPara, startOffset, endPara, endOffset)
	if err != nil {
		return TextChunkMessage{}, err
	}

	return TextChunkMessage{
		Metadata: metadata,
		Content:  strings.Join(chunkWords, " "),
	}, nil
}

// validate ensures the userID is present and respects rate limits
func (sp *SlidesProcessor) SlidesValidate(ctx context.Context, userID string) error {
	if userID == "" {
		return fmt.Errorf("userID required for per-user rate limiting")
	}
	if err := sp.rateLimiter.Wait(ctx, "GOOGLE_SLIDES", userID); err != nil {
		return fmt.Errorf("rate limit wait failed: %w", err)
	}

	return nil
}

// fetchDocument retrieves a Google Slides presentation by its resource ID
func (sp *SlidesProcessor) SlidesFetchDocument(ctx context.Context, resourceID string) (*slides.Presentation, error) {
	presentation, err := sp.service.Presentations.Get(resourceID).Do()
	if err != nil {
		return nil, fmt.Errorf("failed to get presentation: %w", err)
	}

	return presentation, nil
}

// ChunkPresentation splits a Google Slides presentation into text chunks
func (sp *SlidesProcessor) ChunkPresentation(presentation *slides.Presentation, baseMetadata Metadata) ([]TextChunkMessage, error) {
	var chunks []TextChunkMessage
	chunkNumber := uint64(1)

	wordInfoList := make([]SlideWordInfo, 0, 1000)

	for slideIndex, slide := range presentation.Slides {
		slideOffset := 0
		for _, element := range slide.PageElements {
			if element.Shape == nil || element.Shape.Text == nil {
				continue
			}

			for _, textElem := range element.Shape.Text.TextElements {
				if textElem.TextRun == nil {
					continue
				}

				content := strings.NewReplacer("\n", " ", "\r", " ").Replace(textElem.TextRun.Content)
				words := strings.Fields(content)

				for _, word := range words {
					wordInfoList = append(wordInfoList, SlideWordInfo{
						SlideIndex:  slideIndex,
						SlideOffset: slideOffset,
						Word:        word,
					})
					slideOffset += len(word) + 1
				}
			}
		}
	}

	totalWords := len(wordInfoList)
	for startIndex := 0; startIndex < totalWords; startIndex += int(sp.baseChunkSize) - int(sp.baseOverlapSize) {

		endIndex := startIndex + int(sp.baseChunkSize)
		if endIndex > totalWords {
			endIndex = totalWords
		}

		if startIndex > 0 && endIndex-startIndex < int(sp.baseOverlapSize) {
			continue
		}

		chunkWords := make([]string, endIndex-startIndex)
		for i := 0; i < endIndex-startIndex; i++ {
			chunkWords[i] = wordInfoList[startIndex+i].Word
		}

		startInfo := wordInfoList[startIndex]
		endInfo := wordInfoList[endIndex-1]
		endOffset := endInfo.SlideOffset + len(endInfo.Word)

		chunk, err := sp.CreateSlidesChunk(chunkWords, baseMetadata, chunkNumber, startInfo.SlideIndex, startInfo.SlideOffset, endInfo.SlideIndex, endOffset)
		if err != nil {
			return nil, err
		}
		chunks = append(chunks, chunk)

		chunkNumber++
	}

	return chunks, nil
}

// createChunk constructs a TextChunkMessage with metadata
func (sp *SlidesProcessor) CreateSlidesChunk(words []string, baseMetadata Metadata, chunkNumber uint64, startSlide, startOffset, endSlide, endOffset int) (TextChunkMessage, error) {
	chunkMetadata := baseMetadata
	chunkMetadata.ChunkNumber = chunkNumber
	chunkMetadata.ChunkSize = uint64(len(words))
	chunkMetadata.ChunkID = fmt.Sprintf("%d-%d-%d-%d", startSlide, startOffset, endSlide, endOffset)

	return TextChunkMessage{
		Metadata: chunkMetadata,
		Content:  strings.Join(words, " "),
	}, nil
}

// parseChunkID extracts chunk boundaries from the ChunkID string
func (sp *SlidesProcessor) ParseSlidesChunkID(chunkID string) (startSlide, startOffset, endSlide, endOffset int, err error) {
	_, err = fmt.Sscanf(chunkID, "%d-%d-%d-%d", &startSlide, &startOffset, &endSlide, &endOffset)
	if err != nil {
		return 0, 0, 0, 0, fmt.Errorf("invalid ChunkID format: %w", err)
	}

	return startSlide, startOffset, endSlide, endOffset, nil
}

// extractSlidesChunk retrieves words for a specific chunk based on slide and offset boundaries
func (sp *SlidesProcessor) ExtractSlidesChunk(presentation *slides.Presentation, startSlide, startOffset, endSlide, endOffset int) ([]string, error) {
	var chunkWords []string

	slideMap := make(map[int]*slides.Page, len(presentation.Slides))
	for idx, slide := range presentation.Slides {
		slideMap[idx] = slide
	}

	for slideIdx := startSlide; slideIdx <= endSlide; slideIdx++ {
		slide, exists := slideMap[slideIdx]
		if !exists {
			continue
		}

		slideWords := make([]string, 0, 100)
		slideOffsets := make([]int, 0, 100)
		slideOffset := 0

		for _, element := range slide.PageElements {
			if element.Shape == nil || element.Shape.Text == nil {
				continue
			}

			for _, textElem := range element.Shape.Text.TextElements {
				if textElem.TextRun == nil {
					continue
				}

				content := strings.NewReplacer("\n", " ", "\r", " ").Replace(textElem.TextRun.Content)
				words := strings.Fields(content)

				for _, word := range words {
					slideWords = append(slideWords, word)
					slideOffsets = append(slideOffsets, slideOffset)
					slideOffset += len(word) + 1
				}
			}
		}

		for i, offset := range slideOffsets {
			if i >= len(slideWords) {
				break
			}

			inChunk := false
			if slideIdx == startSlide && slideIdx == endSlide {
				inChunk = offset >= startOffset && offset < endOffset
			} else if slideIdx == startSlide {
				inChunk = offset >= startOffset
			} else if slideIdx == endSlide {
				inChunk = offset < endOffset
			} else {
				inChunk = true
			}

			if inChunk {
				chunkWords = append(chunkWords, slideWords[i])
			}
		}
	}

	if len(chunkWords) == 0 {
		return nil, fmt.Errorf("no content found for chunk with boundaries StartSlide:%d-StartOffset:%d-EndSlide:%d-EndOffset:%d",
			startSlide, startOffset, endSlide, endOffset)
	}

	return chunkWords, nil
}

// ProcessGoogleSlides processes a Google Slides presentation into chucks
func ProcessGoogleSlides(ctx context.Context, client *http.Client, file File) (File, error) {
	processor, err := NewSlidesProcessor(ctx, client, rateLimiter)
	if err != nil {
		return file, err
	}
	return processor.SlidesProcess(ctx, file)
}

// RetrieveGoogleSlides retrieves a specific chunk from a Google Slides presentation
func RetrieveGoogleSlides(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	processor, err := NewSlidesProcessor(ctx, client, rateLimiter)
	if err != nil {
		return TextChunkMessage{}, err
	}
	return processor.SlidesRetrieve(ctx, metadata)
}
