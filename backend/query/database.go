package main

import (
	"context"
	"fmt"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/google/generative-ai-go/genai"

	"google.golang.org/protobuf/proto"
)

func (s *queryServer) convertConversationToChatHistory(conversation *pb.QueryConversation) []*genai.Content {
	var chatHistory []*genai.Content
	for _, message := range conversation.Messages {
		if message.Sender == "user" {
			chatHistory = append(chatHistory, &genai.Content{
				Parts: []genai.Part{
					genai.Text(message.Text),
				},
				Role: "user",
			})
		} else if message.Sender == "model" {
			chatHistory = append(chatHistory, &genai.Content{
				Parts: []genai.Part{
					genai.Text(message.Text),
				},
				Role: "model",
			})
		}
	}
	return chatHistory
}

// func(context, conversation id)
//   - creates a new empty conversation in the database
//   - assumes: database is connected
func (s *queryServer) createNewConversation(ctx context.Context, conversationID string) error {
	// Create a new empty conversation
	conversation := &pb.QueryConversation{
		ConversationId: conversationID,
		Messages:       []*pb.QueryMessage{},
	}

	return s.storeConversation(ctx, conversation)
}

// func(context, conversation object)
//   - stores a conversation in the database (will also overwrite and update existing conversations)
//   - TODO: compress long conversations by summarizing them
//   - assumes: database is connected
func (s *queryServer) storeConversation(ctx context.Context, conversation *pb.QueryConversation) error {
	// Convert to protobuf for storage
	conversationBytes, err := proto.Marshal(conversation)
	if err != nil {
		return fmt.Errorf("failed to marshal conversation: %w", err)
	}

	// Check if the conversation already exists to get the revision
	var rev string
	exists, err := s.conversationExists(ctx, conversation.ConversationId)
	if err != nil {
		return fmt.Errorf("failed to check if conversation exists: %w", err)
	}
	if exists {
		// Get the current document to retrieve the _rev value
		row := s.conversationsDB.Get(ctx, conversation.ConversationId)
		if row.Err() != nil {
			return fmt.Errorf("failed to get conversation document for update: %w", row.Err())
		}

		var doc map[string]any
		if err := row.ScanDoc(&doc); err != nil {
			return fmt.Errorf("failed to scan conversation document for update: %w", err)
		}
		rev = doc["_rev"].(string)
	}

	// Create document in CouchDB and insert old revision if exists
	doc := map[string]any{
		"conversation": conversationBytes,
	}
	if rev != "" {
		doc["_rev"] = rev
	}

	_, err = s.conversationsDB.Put(ctx, conversation.ConversationId, doc)
	if err != nil {
		return fmt.Errorf("failed to store conversation in database: %w", err)
	}

	return nil
}

// func(context, conversation id)
//   - checks if a conversation exists in the database
//   - returns true if the conversation exists, false otherwise
//   - assumes: database is connected
func (s *queryServer) conversationExists(ctx context.Context, conversationID string) (bool, error) {
	row := s.conversationsDB.Get(ctx, conversationID)
	if row.Err() != nil {
		// If the error indicates that the document doesn't exist, return false
		if row.Err().Error() == "Not Found: missing" {
			return false, nil
		}
		// For any other error, return it
		return false, fmt.Errorf("failed to check if conversation exists: %w", row.Err())
	}
	return true, nil
}

// func(context, conversation id)
//   - retrieves a conversation from the database
//   - if the conversation doesn't exist, it will return a new one
//   - assumes: database is connected
func (s *queryServer) getConversation(ctx context.Context, conversationID string) (*pb.QueryConversation, error) {

	exists, err := s.conversationExists(ctx, conversationID)
	if err != nil {
		return nil, fmt.Errorf("failed to check if conversation exists: %w", err)
	}
	if !exists {
		if err := s.createNewConversation(ctx, conversationID); err != nil {
			return nil, fmt.Errorf("failed to create new conversation: %w", err)
		}
	}

	// Get the document from CouchDB
	row := s.conversationsDB.Get(ctx, conversationID)
	if row.Err() != nil {
		return nil, fmt.Errorf("failed to get conversation from database: %w", row.Err())
	}

	// Extract data from the document
	var doc struct {
		Conversation []byte `json:"conversation"`
	}

	if err := row.ScanDoc(&doc); err != nil {
		return nil, fmt.Errorf("failed to scan conversation document: %w", err)
	}

	// Unmarshal the conversation
	conversation := &pb.QueryConversation{}
	if err := proto.Unmarshal(doc.Conversation, conversation); err != nil {
		return nil, fmt.Errorf("failed to unmarshal conversation: %w", err)
	}

	return conversation, nil
}

// func(context, conversation id, new query message)
//   - appends a new message to an existing conversation corresponding with conversation id and saves it in the database
//   - assumes: database is connected
func (s *queryServer) appendToConversation(ctx context.Context, conversationID string, message *pb.QueryMessage) error {
	// Get the current conversation
	conversation, err := s.getConversation(ctx, conversationID)
	if err != nil {
		return fmt.Errorf("failed to get conversation for appending: %w", err)
	}

	// Append the new message
	conversation.Messages = append(conversation.Messages, message)

	// Store the updated conversation
	return s.storeConversation(ctx, conversation)
}

// func(context, conversation id)
//   - removes a conversation from the database
//   - assumes: database is connected
func (s *queryServer) deleteConversation(ctx context.Context, conversationID string) error {
	// Get the current document to retrieve the _rev value
	row := s.conversationsDB.Get(ctx, conversationID)
	if row.Err() != nil {
		return fmt.Errorf("failed to get conversation document for deletion: %w", row.Err())
	}

	var doc map[string]any
	if err := row.ScanDoc(&doc); err != nil {
		return fmt.Errorf("failed to scan conversation document for deletion: %w", err)
	}

	// Delete the document
	_, err := s.conversationsDB.Delete(ctx, conversationID, doc["_rev"].(string))
	if err != nil {
		return fmt.Errorf("failed to delete conversation from database: %w", err)
	}

	return nil
}
