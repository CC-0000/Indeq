package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type queryServer struct {
	pb.UnimplementedQueryServiceServer
	rabbitMQConn *amqp.Connection
}

func (s *queryServer) MakeQuery(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	// Make a request to the llm
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Send req to llm
	log.Println("attempting to make request to llm")
	llmReq, _ := http.NewRequestWithContext(ctx, "POST", os.Getenv("OLLAMA_URL"), strings.NewReader(fmt.Sprintf(`{
        "model": "%s",
        "prompt": "%s",
        "stream": true
    }`, os.Getenv("LLM_MODEL"), req.Query)))

	llmReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	llmRes, err := client.Do(llmReq)
	if err != nil {
		log.Printf("failed to make query to llm: %v", err)
	}
	defer llmRes.Body.Close()
	scanner := bufio.NewScanner(llmRes.Body)

	// Create a channel
	channel, err := s.rabbitMQConn.Channel()
	if err != nil {
		log.Fatal(err)
	}
	defer channel.Close()

	// Create notification channels for when the client closes the channel --> cancel the context
	notifyClose := channel.NotifyClose(make(chan *amqp.Error, 1))
	notifyCancel := channel.NotifyCancel(make(chan string, 1))
	go func() {
		select {
		case <-notifyClose:
			log.Println("Channel closed")
			cancel()
		case <-notifyCancel:
			log.Println("Channel cancelled")
			cancel()
		}
	}()

	queue, err := channel.QueueDeclare(
		req.ConversationId, // queue name
		false,              // durable
		true,               // delete when unused
		false,              // exclusive
		false,              // no-wait
		amqp.Table{ // arguments
			"x-expires": 300000, // 5 minutes in milliseconds
		},
	)
	if err != nil {
		log.Fatal(err)
	}

	// Keeps on reading until there are no more tokens
	for scanner.Scan() {
		select {
		case <-ctx.Done():
			return &pb.QueryResponse{
				Success: false,
			}, fmt.Errorf("client has disconnected")
		default:
			_, err := channel.QueueDeclarePassive(
				req.ConversationId, // queue name
				false,              // durable
				true,               // delete when unused
				false,              // exclusive
				false,              // no-wait
				amqp.Table{ // arguments
					"x-expires": 300000, // 5 minutes in milliseconds
				},
			)
			if err != nil {
				log.Println("Queue gone, aborting processing")
				cancel()
				break
			}

			var result map[string]interface{}
			json.Unmarshal(scanner.Bytes(), &result)
			// stream it to a rabbitMQ message queue
			token, ok := result["response"].(string)
			if !ok {
				log.Printf("Error: response field is not a string")
				continue
			}

			err = channel.PublishWithContext(
				ctx,
				"",         // exchange
				queue.Name, // routing key
				false,      // mandatory
				false,      // immediate
				amqp.Publishing{
					ContentType: "text/plain",
					Body:        []byte(token),
				})
			if err != nil {
				log.Printf("Error publishing message: %v", err)
				continue
			}
		}
	}

	return &pb.QueryResponse{
		Success: true,
	}, nil
}

func main() {
	log.Println("Starting the server...")
	// Load the .env file
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Load the TLS configuration values
	tlsConfig, err := config.LoadServerTLSFromEnv("QUERY_CRT", "QUERY_KEY")
	if err != nil {
		log.Fatal("Error loading TLS config for query service")
	}

	// Connect to RabbitMQ
	rabbitMQConn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer rabbitMQConn.Close()

	// Set up a listener on the port
	grpcAddress := os.Getenv("QUERY_PORT")
	listener, err := net.Listen("tcp", grpcAddress)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()

	log.Println("Creating the query server...")

	// Launch the server on the listener
	opts := []grpc.ServerOption{
		grpc.Creds(credentials.NewTLS(tlsConfig)),
	}
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterQueryServiceServer(grpcServer, &queryServer{rabbitMQConn: rabbitMQConn})
	log.Printf("Query service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatal(err.Error())
	} else {
		log.Printf("Query service served on %v\n", listener.Addr())
	}
}
