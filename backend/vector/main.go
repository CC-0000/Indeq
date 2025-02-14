package main

import (
	"context"
	"log"
	"os"

	"github.com/cc-0000/indeq/common/config"
	"github.com/milvus-io/milvus-sdk-go/v2/client"
)

func main() {
	ctx := context.Background()
	log.Println("Starting the server...")

	// Load the .env file
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize client
	milvusClient, err := client.NewClient(ctx, client.Config{
		Address: os.Getenv("ZILLIZ_ADDRESS"),
		APIKey:  os.Getenv("ZILLIZ_API_KEY"),
	})
	if err != nil {
		log.Fatal(err)
	}
	defer milvusClient.Close()
}
