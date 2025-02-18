// Handles calls made to the embedding model

package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type EmbeddingRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
}

type EmbeddingResponse struct {
	Embedding []float32 `json:"embedding"`
}

func GetEmbedding(ctx context.Context, prompt string) ([]float32, error) {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// construct the request
	embeddingReq := EmbeddingRequest{
		Model:  os.Getenv("EMBED_MODEL"),
		Prompt: prompt,
	}
	jsonBody, err := json.Marshal(embeddingReq)
	if err != nil {
		return nil, fmt.Errorf("error creating request body: %v", err)
	}

	// Send embedding request to llm
	llmReq, _ := http.NewRequestWithContext(ctx, "POST", os.Getenv("EMBED_URL"), bytes.NewBuffer(jsonBody))
	llmReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	llmRes, err := client.Do(llmReq)
	if err != nil {
		return nil, fmt.Errorf("failed to make embedding req to llm: %v", err)
	}
	defer llmRes.Body.Close()

	// Parse and return the response
	body, err := io.ReadAll(llmRes.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %v", err)
	}

	var embeddingRes EmbeddingResponse
	err = json.Unmarshal(body, &embeddingRes)
	if err != nil {
		return nil, fmt.Errorf("error parsing json from response: %v", err)
	}

	return embeddingRes.Embedding, nil
}
