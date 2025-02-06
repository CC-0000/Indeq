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
)

type queryServer struct {
	pb.UnimplementedQueryServiceServer 
	rabbitMQConn *amqp.Connection
}

func (s *queryServer) MakeQuery(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {

	log.Println("attempting to make request to llm")
	llmReq, _ := http.NewRequest("POST", os.Getenv("OLLAMA_URL"), strings.NewReader(fmt.Sprintf(`{
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


    queue, err := channel.QueueDeclare(
        req.UserID, // queue name
        false,     // durable
        false,     // delete when unused
        false,     // exclusive
        false,     // no-wait
        nil,       // arguments
    )
    if err != nil {
        log.Fatal(err)
    }

	for scanner.Scan() {
        var result map[string]interface{}
        json.Unmarshal(scanner.Bytes(), &result)
		// stream it to a rabbitMQ message queue
		response, ok := result["response"].(string)
		if !ok {
			log.Printf("Error: response field is not a string")
			continue
		}

		err = channel.Publish(
			"",     // exchange
			queue.Name, // routing key
			false,  // mandatory
			false,  // immediate
			amqp.Publishing{
				ContentType: "text/plain",
				Body:       []byte(response),
			})
			log.Printf("writing: %v", response)
		if err != nil {
			log.Printf("Error publishing message: %v", err)
			continue
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
	grpcServer := grpc.NewServer()
	pb.RegisterQueryServiceServer(grpcServer, &queryServer{rabbitMQConn: rabbitMQConn})
	log.Printf("Query service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatal(err.Error())
	} else {
		log.Printf("Query service served on %v\n", listener.Addr())
	}

}