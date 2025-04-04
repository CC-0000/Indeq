package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	pb "github.com/cc-0000/indeq/common/api"
	"golang.org/x/oauth2"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Block struct {
	ID             string    `json:"id"`
	Type           string    `json:"type"`
	CreatedTime    time.Time `json:"created_time"`
	LastEditedTime time.Time `json:"last_edited_time"`
	HasChildren    bool      `json:"has_children"`

	Paragraph struct {
		RichText []RichText `json:"rich_text"`
	} `json:"paragraph"`

	Heading1 struct {
		RichText []RichText `json:"rich_text"`
	} `json:"heading_1"`

	Heading2 struct {
		RichText []RichText `json:"rich_text"`
	} `json:"heading_2"`

	Heading3 struct {
		RichText []RichText `json:"rich_text"`
	} `json:"heading_3"`

	BulletedListItem struct {
		RichText []RichText `json:"rich_text"`
	} `json:"bulleted_list_item"`

	NumberedListItem struct {
		RichText []RichText `json:"rich_text"`
	} `json:"numbered_list_item"`

	ToDo struct {
		RichText []RichText `json:"rich_text"`
	} `json:"to_do"`

	Toggle struct {
		RichText []RichText `json:"rich_text"`
	} `json:"toggle"`

	Image struct {
		URL string `json:"url"`
	} `json:"image"`

	Video struct {
		URL string `json:"url"`
	} `json:"video"`

	File struct {
		URL string `json:"url"`
	} `json:"file"`

	PDF struct {
		URL string `json:"url"`
	} `json:"pdf"`

	Divider struct {
		URL string `json:"url"`
	} `json:"divider"`

	ChildDatabase struct {
		URL string `json:"url"`
	} `json:"child_database"`

	ChildPage struct {
		URL string `json:"url"`
	} `json:"child_page"`
}

type RichText struct {
	Type string `json:"type"`
	Text struct {
		Content string `json:"content"`
		Link    *struct {
			URL string `json:"url"`
		} `json:"link"`
	} `json:"text"`
	PlainText string  `json:"plain_text"`
	Href      *string `json:"href"`
}

type NotionObject struct {
	ID             string    `json:"id"`
	Object         string    `json:"object"`
	CreatedTime    time.Time `json:"created_time"`
	LastEditedTime time.Time `json:"last_edited_time"`
	URL            string    `json:"url"`
	Parent         struct {
		Type string `json:"type"`
	} `json:"parent"`
	Properties map[string]interface{} `json:"properties"`
}

type NotionSearchResponse struct {
	Results    []NotionObject `json:"results"`
	NextCursor string         `json:"next_cursor"`
	HasMore    bool           `json:"has_more"`
}

type NotionPageResponse struct {
	Results []Block `json:"results"`
}

type NotionDatabase struct {
	ID             string                 `json:"id"`
	Object         string                 `json:"object"`
	CreatedTime    time.Time              `json:"created_time"`
	LastEditedTime time.Time              `json:"last_edited_time"`
	URL            string                 `json:"url"`
	Title          []RichText             `json:"title"`
	Description    []RichText             `json:"description"`
	Properties     map[string]interface{} `json:"properties"`
	Parent         struct {
		Type   string `json:"type"`
		PageID string `json:"page_id"`
	} `json:"parent"`
}

type NotionDatabaseResponse struct {
	Results    []map[string]interface{} `json:"results"`
	NextCursor string                   `json:"next_cursor"`
	HasMore    bool                     `json:"has_more"`
}

func createNotionOAuthClient(ctx context.Context, accessToken string) *http.Client {
	tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken})
	return oauth2.NewClient(ctx, tokenSource)
}

func (s *crawlingServer) NotionCrawler(ctx context.Context, client *http.Client, userID string, scopes []string) (ListofFiles, error) {
	files, err := s.NotionSearch(ctx, client, userID, scopes)
	if err != nil {
		return ListofFiles{}, fmt.Errorf("failed to search for objects: %w", err)
	}
	processedFiles := s.processNotionFiles(ctx, client, files)
	if processedFiles.Files == nil {
		return ListofFiles{}, nil
	}
	return processedFiles, nil
}

func (s *crawlingServer) NotionSearch(ctx context.Context, client *http.Client, userID string, scopes []string) (ListofFiles, error) {
	var files ListofFiles
	nextCursor := ""
	for {
		searchBody := map[string]interface{}{
			"sort": map[string]interface{}{
				"direction": "descending",
				"timestamp": "last_edited_time",
			},
			"page_size": 100,
		}
		if nextCursor != "" {
			searchBody["start_cursor"] = nextCursor
		}

		bodyBytes, err := json.Marshal(searchBody)
		if err != nil {
			return files, fmt.Errorf("failed to marshal search body: %w", err)
		}

		req, err := http.NewRequest("POST", "https://api.notion.com/v1/search", bytes.NewBuffer(bodyBytes))
		if err != nil {
			return files, fmt.Errorf("failed to create request: %w", err)
		}
		req.Header.Set("Notion-Version", "2022-06-28")
		req.Header.Set("Content-Type", "application/json")

		resp, err := client.Do(req)
		if err != nil {
			return files, fmt.Errorf("failed to send request: %w", err)
		}
		defer resp.Body.Close()

		var searchResp NotionSearchResponse
		if err := json.NewDecoder(resp.Body).Decode(&searchResp); err != nil {
			return files, fmt.Errorf("failed to decode search response: %w", err)
		}

		for _, page := range searchResp.Results {
			metadata := Metadata{
				DateCreated:      page.CreatedTime,
				DateLastModified: page.LastEditedTime,
				UserID:           userID,
				ResourceID:       page.ID,
				ResourceType:     page.Object,
				FileURL:          page.URL,
				Title:            "",
				Platform:         "NOTION",
				Service:          "NOTION",
			}

			file := File{
				File: []TextChunkMessage{
					{
						Metadata: metadata,
						Content:  "",
					},
				},
			}
			files.Files = append(files.Files, file)
		}

		if !searchResp.HasMore {
			break
		}
		nextCursor = searchResp.NextCursor
	}
	return files, nil
}

func (s *crawlingServer) processNotionFiles(ctx context.Context, client *http.Client, files ListofFiles) ListofFiles {
	var processedFiles ListofFiles
	if len(files.Files) == 0 {
		return files
	}
	for _, file := range files.Files {
		if len(file.File) == 0 {
			continue
		}

		switch file.File[0].Metadata.ResourceType {
		case "page":
			pageFile := s.processNotionPage(ctx, client, file)
			if len(pageFile.File) > 0 {
				processedFiles.Files = append(processedFiles.Files, pageFile)
				for _, chunk := range pageFile.File {
					if err := s.sendChunkToVector(ctx, chunk); err != nil {
						continue
					}
					if len(file.File) > 0 {
						if err := s.sendFileDoneSignal(ctx, file.File[0].Metadata.UserID, file.File[0].Metadata.FilePath, "NOTION"); err != nil {
							continue
						}
					}

				}
			}
		case "database":
			dbFile := s.processNotionDatabase(ctx, client, file)
			if len(dbFile.File) > 0 {
				processedFiles.Files = append(processedFiles.Files, dbFile)
			}
		}
	}
	if len(processedFiles.Files) > 0 {
		if err := s.sendCrawlDoneSignal(ctx, processedFiles.Files[0].File[0].Metadata.UserID, "NOTION"); err != nil {
			fmt.Println("Error sending crawl done signal:", err)
		}
	}

	for _, file := range processedFiles.Files {
		fmt.Println("--------------------------------")
		fmt.Println(file.File[0].Metadata.ResourceID)
		fmt.Println(file.File[0].Metadata.Title)
		for _, chunk := range file.File {
			fmt.Println(chunk.Content)
			fmt.Println(chunk.Metadata.ChunkID)
		}
		fmt.Println("--------------------------------")
	}
	return processedFiles
}

func (s *crawlingServer) processNotionPage(ctx context.Context, client *http.Client, file File) File {
	if len(file.File) == 0 {
		return File{}
	}

	pageID := file.File[0].Metadata.ResourceID
	pageReq, err := http.NewRequest("GET", fmt.Sprintf("https://api.notion.com/v1/pages/%s", pageID), nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return File{}
	}
	pageReq.Header.Set("Notion-Version", "2022-06-28")
	pageResp, err := client.Do(pageReq)
	if err != nil {
		fmt.Println("Error executing request:", err)
		return File{}
	}
	defer pageResp.Body.Close()

	var pageResponse NotionObject
	if err := json.NewDecoder(pageResp.Body).Decode(&pageResponse); err != nil {
		return File{}
	}

	var pageTitle string
	if title, ok := pageResponse.Properties["title"].(map[string]interface{}); ok {
		if titleArray, ok := title["title"].([]interface{}); ok {
			if textObj, ok := titleArray[0].(map[string]interface{}); ok {
				if text, ok := textObj["text"].(map[string]interface{}); ok {
					if content, ok := text["content"].(string); ok {
						pageTitle = content
					}
				}
			}
		}
	}

	blockReq, err := http.NewRequest("GET", fmt.Sprintf("https://api.notion.com/v1/blocks/%s/children", pageID), nil)
	if err != nil {
		fmt.Println("Error creating block request:", err)
		return File{}
	}

	blockReq.Header.Set("Notion-Version", "2022-06-28")
	blockResp, err := client.Do(blockReq)
	if err != nil {
		fmt.Println("Error executing block request:", err)
		return File{}
	}
	defer blockResp.Body.Close()

	var blockResponse NotionPageResponse
	if err := json.NewDecoder(blockResp.Body).Decode(&blockResponse); err != nil {
		return File{}
	}

	const chunkSize = 400
	const overlap = 80
	var chunks []TextChunkMessage
	currentChunk := ""
	currentWords := []string{}
	chunkID := "StartOffset->0" + "/"

	for _, block := range blockResponse.Results {
		blockContent := ""
		switch block.Type {
		case "paragraph":
			for _, text := range block.Paragraph.RichText {
				blockContent += text.PlainText + " "
			}
		case "heading_1":
			for _, text := range block.Heading1.RichText {
				blockContent += text.PlainText + " "
			}
		case "heading_2":
			for _, text := range block.Heading2.RichText {
				blockContent += text.PlainText + " "
			}
		case "heading_3":
			for _, text := range block.Heading3.RichText {
				blockContent += text.PlainText + " "
			}
		case "bulleted_list_item":
			for _, text := range block.BulletedListItem.RichText {
				blockContent += "• "
				blockContent += text.PlainText + "\n"
			}
		case "numbered_list_item":
			for _, text := range block.NumberedListItem.RichText {
				blockContent += text.PlainText + "\n"
			}
		case "to_do":
			blockContent += "☐ "
			for _, text := range block.ToDo.RichText {
				blockContent += text.PlainText + "\n"
			}
		case "toggle":
			for _, text := range block.Toggle.RichText {
				blockContent += text.PlainText + " "
			}
		case "image":
			blockContent += "Image: " + block.Image.URL + "\n"
		case "video":
			blockContent += "Video: " + block.Video.URL + "\n"
		case "file":
			blockContent += "File: " + block.File.URL + "\n"
		case "pdf":
			blockContent += "PDF: " + block.PDF.URL + "\n"
		case "divider":
			blockContent += "Divider: " + block.Divider.URL + "\n"
		case "child_database":
			blockContent += "Child Database: " + block.ChildDatabase.URL + "\n"
		case "child_page":
			blockContent += "Child Page: " + block.ChildPage.URL + "\n"
		}
		chunkID += block.ID + "/"
		words := strings.Fields(blockContent)
		for _, word := range words {
			currentWords = append(currentWords, word)
			currentChunk += word + " "
			if len(currentWords) >= chunkSize {
				chunkID += "EndOffset->" + strconv.Itoa(len(word))
				metadata := Metadata{
					DateCreated:      pageResponse.CreatedTime,
					DateLastModified: pageResponse.LastEditedTime,
					UserID:           file.File[0].Metadata.UserID,
					ResourceID:       pageResponse.ID,
					ResourceType:     pageResponse.Object,
					FileURL:          pageResponse.URL,
					Title:            pageTitle,
					Platform:         "NOTION",
					Service:          "NOTION",
					ChunkID:          chunkID,
				}

				chunks = append(chunks, TextChunkMessage{
					Metadata: metadata,
					Content:  strings.TrimSpace(currentChunk),
				})
				chunkID = "StartOffset->" + strconv.Itoa(len(word)) + "/" + block.ID + "/"
				overlapWords := currentWords[len(currentWords)-overlap:]
				currentWords = overlapWords
				currentChunk = strings.Join(overlapWords, " ") + " "
			}
		}
	}
	if len(currentWords) > 0 {
		metadata := Metadata{
			DateCreated:      pageResponse.CreatedTime,
			DateLastModified: pageResponse.LastEditedTime,
			UserID:           file.File[0].Metadata.UserID,
			ResourceID:       pageResponse.ID,
			ResourceType:     pageResponse.Object,
			FileURL:          pageResponse.URL,
			Title:            pageTitle,
			ChunkID:          chunkID + "/" + "EndOffset->" + strconv.Itoa(len(currentWords)),
			Platform:         "NOTION",
			Service:          "NOTION",
		}
		chunks = append(chunks, TextChunkMessage{
			Metadata: metadata,
			Content:  strings.TrimSpace(currentChunk),
		})
	}

	return File{File: chunks}
}

func (s *crawlingServer) processNotionDatabase(ctx context.Context, client *http.Client, file File) File {
	dbID := file.File[0].Metadata.ResourceID

	dbReq, err := http.NewRequest("GET", fmt.Sprintf("https://api.notion.com/v1/databases/%s", dbID), nil)
	if err != nil {
		fmt.Println("Error creating database request:", err)
		return File{}
	}
	dbReq.Header.Set("Notion-Version", "2022-06-28")
	dbResp, err := client.Do(dbReq)
	if err != nil {
		fmt.Println("Error executing database request:", err)
		return File{}
	}
	defer dbResp.Body.Close()

	var dbResponse NotionDatabase
	if err := json.NewDecoder(dbResp.Body).Decode(&dbResponse); err != nil {
		fmt.Println("Error decoding database response:", err)
		return File{}
	}

	dbTitle := ""
	for _, text := range dbResponse.Title {
		dbTitle += text.PlainText
	}

	dbDescription := ""
	for _, text := range dbResponse.Description {
		dbDescription += text.PlainText
	}

	content := ""

	if dbDescription != "" {
		content += dbDescription
	}

	for _, propValue := range dbResponse.Properties {
		propDetails, ok := propValue.(map[string]interface{})
		if !ok {
			continue
		}

		propType, ok := propDetails["type"].(string)
		if !ok {
			continue
		}

		content += propType
	}

	nextCursor := ""
	for {
		queryBody := map[string]interface{}{
			"page_size": 100,
		}
		if nextCursor != "" {
			queryBody["start_cursor"] = nextCursor
		}

		bodyBytes, err := json.Marshal(queryBody)
		if err != nil {
			fmt.Println("Error marshaling query body:", err)
			break
		}

		queryReq, err := http.NewRequest("POST", fmt.Sprintf("https://api.notion.com/v1/databases/%s/query", dbID), bytes.NewBuffer(bodyBytes))
		if err != nil {
			fmt.Println("Error creating query request:", err)
			break
		}
		queryReq.Header.Set("Notion-Version", "2022-06-28")
		queryReq.Header.Set("Content-Type", "application/json")

		queryResp, err := client.Do(queryReq)
		if err != nil {
			fmt.Println("Error executing query request:", err)
			break
		}

		var dbQueryResponse NotionDatabaseResponse
		if err := json.NewDecoder(queryResp.Body).Decode(&dbQueryResponse); err != nil {
			fmt.Println("Error decoding query response:", err)
			queryResp.Body.Close()
			break
		}
		queryResp.Body.Close()

		for _, row := range dbQueryResponse.Results {
			properties, ok := row["properties"].(map[string]interface{})
			if !ok {
				continue
			}

			for _, propValue := range properties {
				propObj, ok := propValue.(map[string]interface{})
				if !ok {
					continue
				}

				propType, ok := propObj["type"].(string)
				if !ok {
					continue
				}

				switch propType {
				case "title":
					titleArray, ok := propObj["title"].([]interface{})
					if ok && len(titleArray) > 0 {
						textObj, ok := titleArray[0].(map[string]interface{})
						if ok {
							plainText, ok := textObj["plain_text"].(string)
							if ok {
								content += plainText + "\n"
							}
						}
					}
				case "rich_text":
					richTextArray, ok := propObj["rich_text"].([]interface{})
					if ok && len(richTextArray) > 0 {
						textObj, ok := richTextArray[0].(map[string]interface{})
						if ok {
							plainText, ok := textObj["plain_text"].(string)
							if ok {
								content += plainText + "\n"
							}
						}
					}
				case "number":
					if number, ok := propObj["number"].(float64); ok {
						content += fmt.Sprintf("%.2f\n", number)
					}
				case "select":
					selectObj, ok := propObj["select"].(map[string]interface{})
					if ok {
						name, ok := selectObj["name"].(string)
						if ok {
							content += name + "\n"
						}
					}
				case "multi_select":
					multiSelectArray, ok := propObj["multi_select"].([]interface{})
					if ok {
						values := []string{}
						for _, item := range multiSelectArray {
							if itemObj, ok := item.(map[string]interface{}); ok {
								if name, ok := itemObj["name"].(string); ok {
									values = append(values, name)
								}
							}
						}
						content += strings.Join(values, ", ") + "\n"
					}
				case "date":
					dateObj, ok := propObj["date"].(map[string]interface{})
					if ok {
						start, _ := dateObj["start"].(string)
						end, _ := dateObj["end"].(string)
						if end != "" {
							content += fmt.Sprintf("%s to %s\n", start, end)
						} else {
							content += start + "\n"
						}
					}
				case "checkbox":
					if checkbox, ok := propObj["checkbox"].(bool); ok {
						content += fmt.Sprintf("%v\n", checkbox)
					}
				}

			}
			content += "\n"
		}

		if !dbQueryResponse.HasMore {
			break
		}
		nextCursor = dbQueryResponse.NextCursor
	}

	metadata := Metadata{
		DateCreated:      dbResponse.CreatedTime,
		DateLastModified: dbResponse.LastEditedTime,
		UserID:           file.File[0].Metadata.UserID,
		ResourceID:       dbResponse.ID,
		ResourceType:     "database",
		FileURL:          dbResponse.URL,
		Title:            dbTitle,
		Platform:         "NOTION",
		Service:          "NOTION",
	}

	file.File[0].Metadata = metadata
	file.File[0].Content = content

	return file
}

func RetrieveNotionCrawler(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	// if metadata.ResourceType == "database" {
	// 	return processNotionDatabase(ctx, client, metadata)
	// }
	if metadata.ResourceType == "page" {
		return retriveNotionPage(ctx, client, metadata)
	}
	return TextChunkMessage{}, fmt.Errorf("unsupported resource type: %s", metadata.ResourceType)
}

func retriveNotionPage(ctx context.Context, client *http.Client, metadata Metadata) (TextChunkMessage, error) {
	pageID := metadata.ResourceID
	pageReq, err := http.NewRequest("GET", fmt.Sprintf("https://api.notion.com/v1/pages/%s", pageID), nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return TextChunkMessage{}, err
	}
	pageReq.Header.Set("Notion-Version", "2022-06-28")
	pageResp, err := client.Do(pageReq)
	if err != nil {
		fmt.Println("Error executing request:", err)
		return TextChunkMessage{}, err
	}
	defer pageResp.Body.Close()

	var pageResponse NotionObject
	if err := json.NewDecoder(pageResp.Body).Decode(&pageResponse); err != nil {
		return TextChunkMessage{}, err
	}

	blockReq, err := http.NewRequest("GET", fmt.Sprintf("https://api.notion.com/v1/blocks/%s/children", pageID), nil)
	if err != nil {
		fmt.Println("Error creating block request:", err)
		return TextChunkMessage{}, err
	}

	blockReq.Header.Set("Notion-Version", "2022-06-28")
	blockResp, err := client.Do(blockReq)
	if err != nil {
		fmt.Println("Error executing block request:", err)
		return TextChunkMessage{}, err
	}
	defer blockResp.Body.Close()

	var blockResponse NotionPageResponse
	if err := json.NewDecoder(blockResp.Body).Decode(&blockResponse); err != nil {
		return TextChunkMessage{}, err
	}

	chunkID := metadata.ChunkID
	startOffset, endOffset, blockIDs, err := parseChuckID(chunkID)
	if err != nil {
		return TextChunkMessage{}, err
	}

	blockIDMap := make(map[string]bool)
	for _, id := range blockIDs {
		blockIDMap[id] = true
	}

	var content strings.Builder
	for _, block := range blockResponse.Results {
		if !blockIDMap[block.ID] {
			continue
		}

		blockContent := ""
		switch block.Type {
		case "paragraph":
			for _, text := range block.Paragraph.RichText {
				blockContent += text.PlainText + " "
			}
		case "heading_1":
			for _, text := range block.Heading1.RichText {
				blockContent += text.PlainText + " "
			}
		case "heading_2":
			for _, text := range block.Heading2.RichText {
				blockContent += text.PlainText + " "
			}
		case "heading_3":
			for _, text := range block.Heading3.RichText {
				blockContent += text.PlainText + " "
			}
		case "bulleted_list_item":
			for _, text := range block.BulletedListItem.RichText {
				blockContent += "• "
				blockContent += text.PlainText + "\n"
			}
		case "numbered_list_item":
			for _, text := range block.NumberedListItem.RichText {
				blockContent += text.PlainText + "\n"
			}
		case "to_do":
			blockContent += "☐ "
			for _, text := range block.ToDo.RichText {
				blockContent += text.PlainText + "\n"
			}
		case "toggle":
			for _, text := range block.Toggle.RichText {
				blockContent += text.PlainText + " "
			}
		case "image":
			blockContent += "Image: " + block.Image.URL + "\n"
		case "video":
			blockContent += "Video: " + block.Video.URL + "\n"
		case "file":
			blockContent += "File: " + block.File.URL + "\n"
		case "pdf":
			blockContent += "PDF: " + block.PDF.URL + "\n"
		case "divider":
			blockContent += "Divider: " + block.Divider.URL + "\n"
		case "child_database":
			blockContent += "Child Database: " + block.ChildDatabase.URL + "\n"
		case "child_page":
			blockContent += "Child Page: " + block.ChildPage.URL + "\n"
		}

		content.WriteString(blockContent)
	}

	finalContent := content.String()
	if startOffset > 0 && startOffset < len(finalContent) {
		finalContent = finalContent[startOffset:]
	}
	if endOffset > 0 && endOffset < len(finalContent) {
		finalContent = finalContent[:endOffset]
	}

	chunk := TextChunkMessage{
		Content: finalContent,
	}

	return chunk, nil
}

func parseChuckID(chunkID string) (int, int, []string, error) {
	parts := strings.Split(chunkID, "/")
	if len(parts) < 2 {
		return 0, 0, nil, fmt.Errorf("invalid chunk ID format: %s", chunkID)
	}

	startOffsetStr := strings.TrimPrefix(parts[0], "StartOffset->")
	startOffset, err := strconv.Atoi(startOffsetStr)
	if err != nil {
		return 0, 0, nil, fmt.Errorf("invalid start offset: %s", startOffsetStr)
	}

	endOffsetStr := strings.TrimPrefix(parts[len(parts)-1], "EndOffset->")
	endOffset, err := strconv.Atoi(endOffsetStr)
	if err != nil {
		return 0, 0, nil, fmt.Errorf("invalid end offset: %s", endOffsetStr)
	}

	blockIDs := parts[1 : len(parts)-1]

	return startOffset, endOffset, blockIDs, nil
}

func (s *crawlingServer) GetChunksFromNotion(ctx context.Context, req *pb.GetChunksFromNotionRequest) (*pb.GetChunksFromNotionResponse, error) {
	accessToken, err := s.retrieveAccessToken(ctx, req.UserId, "NOTION")
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve access token: %w", err)
	}

	client := createNotionOAuthClient(ctx, accessToken)

	type chunkResult struct {
		chunk *pb.TextChunkMessage
		err   error
	}

	// Create channels for results and errors
	resultChan := make(chan chunkResult, len(req.Metadatas))
	var wg sync.WaitGroup

	// Process each metadata in a goroutine
	for _, metadata := range req.Metadatas {
		wg.Add(1)
		go func(meta *pb.Metadata) {
			defer wg.Done()

			// Convert pb.Metadata to internal Metadata
			internalMeta := Metadata{
				DateCreated:      time.Unix(meta.DateCreated.Seconds, int64(meta.DateCreated.Nanos)),
				DateLastModified: time.Unix(meta.DateLastModified.Seconds, int64(meta.DateLastModified.Nanos)),
				UserID:           meta.UserId,
				ResourceID:       meta.FileId,
				ResourceType:     meta.ResourceType,
				FileURL:          meta.FileUrl,
				Title:            meta.Title,
				ChunkID:          meta.ChunkId,
				Platform:         meta.Platform.String(),
				Service:          meta.Service,
			}

			chunk, err := RetrieveNotionCrawler(ctx, client, internalMeta)
			if err != nil {
				resultChan <- chunkResult{nil, err}
				return
			}

			// Convert TextChunkMessage to pb.TextChunkMessage
			pbChunk := &pb.TextChunkMessage{
				Metadata: &pb.Metadata{
					DateCreated:      timestamppb.New(chunk.Metadata.DateCreated),
					DateLastModified: timestamppb.New(chunk.Metadata.DateLastModified),
					UserId:           chunk.Metadata.UserID,
					FileId:           chunk.Metadata.ResourceID,
					ResourceType:     chunk.Metadata.ResourceType,
					FileUrl:          chunk.Metadata.FileURL,
					Title:            chunk.Metadata.Title,
					ChunkId:          chunk.Metadata.ChunkID,
					Platform:         pb.Platform(pb.Platform_value[chunk.Metadata.Platform]),
					Service:          chunk.Metadata.Service,
				},
				Content: chunk.Content,
			}

			resultChan <- chunkResult{pbChunk, nil}
		}(metadata)
	}

	// Close result channel when all goroutines are done
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// Collect results
	var chunks []*pb.TextChunkMessage
	var errors []error

	for result := range resultChan {
		if result.err != nil {
			errors = append(errors, result.err)
			continue
		}
		if result.chunk != nil {
			chunks = append(chunks, result.chunk)
		}
	}

	// If we have any errors, log them but continue with successful chunks
	if len(errors) > 0 {
		fmt.Printf("Encountered %d errors while retrieving chunks: %v\n", len(errors), errors)
	}

	return &pb.GetChunksFromNotionResponse{
		Chunks: chunks,
	}, nil
}
