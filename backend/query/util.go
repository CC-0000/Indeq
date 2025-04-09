package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"slices"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/google/generative-ai-go/genai"
	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/api/iterator"
)

var allowedModels = []string{
	"gemini-2.0-flash-lite",
	"llama-4.0-maverick",
	"qwq-32b",
	"gpt-4o-mini",
	"deepseek-r1-distill-qwen-32b",
	"phi-4",
}

func modelAllowed(model string) bool {
	return slices.Contains(allowedModels, model)
}

func (s *queryServer) sendToLlama4Maverick(ctx context.Context, conversation *pb.QueryConversation, fullprompt string, llmResponse *string, queue amqp.Queue, channel *amqp.Channel) error {
	// // Prepare the request URL
	// apiURL := "https://api.deepinfra.com/v1/openai/chat/completions"

	// // Convert conversation history to messages format for the API
	// messages := []map[string]string{
	// 	{
	// 		"role":    "system",
	// 		"content": s.systemPrompt,
	// 	},
	// }

	// // Add conversation history
	// for _, message := range conversation.SummarizedMessages {
	// 	role := "user"
	// 	if message.Sender == "model" {
	// 		role = "assistant"
	// 	}
	// 	messages = append(messages, map[string]string{
	// 		"role":    role,
	// 		"content": message.Text,
	// 	})
	// }

	// // Add the current query as the last user message
	// messages = append(messages, map[string]string{
	// 	"role":    "user",
	// 	"content": fullprompt,
	// })

	// // Prepare request body
	// requestBody := map[string]interface{}{
	// 	"model":    "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
	// 	"stream":   true,
	// 	"messages": messages,
	// }

	// // Marshal the request body to JSON
	// jsonBody, err := json.Marshal(requestBody)
	// if err != nil {
	// 	return fmt.Errorf("failed to marshal request body: %w", err)
	// }

	// // Create the HTTP request
	// req, err := http.NewRequestWithContext(ctx, "POST", apiURL, bytes.NewBuffer(jsonBody))
	// if err != nil {
	// 	return fmt.Errorf("failed to create HTTP request: %w", err)
	// }

	// // Add headers
	// req.Header.Set("Content-Type", "application/json")
	// req.Header.Set("Authorization", "Bearer "+s.deepInfraApiKey)

	// // Send the request
	// client := &http.Client{}
	// resp, err := client.Do(req)
	// if err != nil {
	// 	return fmt.Errorf("failed to send request to DeepInfra API: %w", err)
	// }
	// defer resp.Body.Close()

	// // Check response status
	// if resp.StatusCode != http.StatusOK {
	// 	body, _ := io.ReadAll(resp.Body)
	// 	return fmt.Errorf("DeepInfra API returned non-200 status code: %d, body: %s", resp.StatusCode, string(body))
	// }

	// // Process the SSE stream
	// scanner := bufio.NewScanner(resp.Body)
	// for scanner.Scan() {
	// 	line := scanner.Text()

	// 	// Skip empty lines and the [DONE] message
	// 	if line == "" || line == "data: [DONE]" {
	// 		continue
	// 	}

	// 	// Extract the data part
	// 	data := strings.TrimPrefix(line, "data: ")

	// 	// Parse the JSON response
	// 	var response struct {
	// 		Choices []struct {
	// 			Delta struct {
	// 				Content string `json:"content"`
	// 			} `json:"delta"`
	// 			FinishReason *string `json:"finish_reason"`
	// 		} `json:"choices"`
	// 	}

	// 	if err := json.Unmarshal([]byte(data), &response); err != nil {
	// 		log.Printf("Error parsing SSE data: %v", err)
	// 		continue
	// 	}

	// 	// Process each choice
	// 	for _, choice := range response.Choices {
	// 		// Skip if there's no content or it's the special end token
	// 		if choice.Delta.Content == "" || choice.Delta.Content == "</s>" {
	// 			continue
	// 		}

	// 		// Check if the queue still exists
	// 		_, err := channel.QueueDeclarePassive(
	// 			queue.Name, // queue name
	// 			false,      // durable
	// 			true,       // delete when unused
	// 			false,      // exclusive
	// 			false,      // no-wait
	// 			amqp.Table{ // arguments
	// 				"x-expires": s.queueTTL, // TTL in milliseconds
	// 			},
	// 		)

	// 		if err == nil {
	// 			// Queue exists, send the token
	// 			queueTokenMessage := &pb.QueryTokenMessage{
	// 				Type:  "token",
	// 				Token: choice.Delta.Content,
	// 			}

	// 			byteMessage, err := json.Marshal(queueTokenMessage)
	// 			if err != nil {
	// 				log.Printf("Error marshalling token message: %v", err)
	// 				continue
	// 			}

	// 			err = s.sendToQueue(ctx, channel, queue.Name, byteMessage)
	// 			if err != nil {
	// 				log.Printf("Error publishing message: %v", err)
	// 				continue
	// 			}
	// 		}

	// 		// Append to the complete response
	// 		*llmResponse += choice.Delta.Content
	// 	}
	// }

	// if err := scanner.Err(); err != nil {
	// 	return fmt.Errorf("error reading response stream: %w", err)
	// }

	return nil
}

func (s *queryServer) sendToGemini2FlashLite(ctx context.Context, conversation *pb.QueryConversation, fullprompt string, llmResponse *string, queue amqp.Queue, channel *amqp.Channel) error {
	session := s.geminiFlash2ModelHeavy.StartChat()
	session.History = s.convertConversationToSummarizedChatHistory(conversation)

	// send the message to the llm
	iter := session.SendMessageStream(ctx, genai.Text(fullprompt))

	// send the tokens
	for {
		resp, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return fmt.Errorf("error streaming response from gemini: %w", err)
		}

		for _, candidate := range resp.Candidates {
			for _, part := range candidate.Content.Parts {
				// check if the queue still exists
				_, err := channel.QueueDeclarePassive(
					queue.Name, // queue name
					false,      // durable
					true,       // delete when unused
					false,      // exclusive
					false,      // no-wait
					amqp.Table{ // arguments
						"x-expires": s.queueTTL, // 5 minutes in milliseconds
					},
				)
				if err == nil {
					// only send tokens if the queue still exists
					// create our token type
					queueTokenMessage := &pb.QueryTokenMessage{
						Type:  "token",
						Token: fmt.Sprintf("%v", part),
					}
					byteMessage, err := json.Marshal(queueTokenMessage)
					if err != nil {
						log.Printf("Error marshalling token message: %v", err)
						continue
					}

					err = s.sendToQueue(ctx, channel, queue.Name, byteMessage)
					if err != nil {
						log.Printf("Error publishing message: %v", err)
						continue
					}
				}
				*llmResponse += fmt.Sprintf("%v", part)
			}
		}
	}

	return nil
}
