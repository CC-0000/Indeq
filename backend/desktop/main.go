package main

import (
	"context"
	"crypto/tls"
	"fmt"

	// "fmt"
	"log"
	"net"
	"os"
	"time"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/segmentio/kafka-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type desktopServer struct {
	pb.UnimplementedDesktopServiceServer
	mqttClient mqtt.Client
}

func (s *desktopServer) GetChunksFromUser(ctx context.Context, req *pb.GetChunksFromUserRequest) (*pb.GetChunksFromUserResponse, error) {
	return nil, nil
}

func startGRPCServer(mqttClient mqtt.Client) {
	log.Println("Starting the desktop gRPC server...")

	grpcAddress := os.Getenv("DESKTOP_PORT")

	tlsConfig, err := config.LoadServerTLSFromEnv("DESKTOP_CRT", "DESKTOP_KEY")
	if err != nil {
		log.Fatal("Error loading TLS config for desktop service")
	}

	listener, err := net.Listen("tcp", grpcAddress)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	defer listener.Close()

	opts := []grpc.ServerOption{
		grpc.Creds(credentials.NewTLS(tlsConfig)),
	}
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterDesktopServiceServer(grpcServer, &desktopServer{
		mqttClient: mqttClient,
	})
	log.Printf("Desktop gRPC Service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	} else {
		log.Printf("Desktop gRPC Service served on %v\n", listener.Addr())
	}
}

func connectToMQTTBroker(tlsConfig *tls.Config, kafkaWriter *kafka.Writer) mqtt.Client {
	mqttAddress := os.Getenv("MQTT_ADDRESS")
	clientID := "desktop_mqtt_client"
	topic := "test/topic"

	// Connection handler
	connectHandler := func(client mqtt.Client) {
		log.Println("Connected to mqtt broker")
	}

	// Connection lost handler
	connectLostHandler := func(client mqtt.Client, err error) {
		log.Printf("Mqtt broker connection lost: %v\n", err)
	}

	// message listener
	messagePubHandler := func(client mqtt.Client, msg mqtt.Message) {
		log.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
	}

	// Create client options
	opts := mqtt.NewClientOptions()
	opts.SetTLSConfig(tlsConfig)
	opts.AddBroker(mqttAddress)
	opts.SetClientID(clientID)
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler
	opts.SetAutoReconnect(true) // Enable automatic reconnection

	// Create and start client
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Print(token.Error())
		panic(token.Error())
	}

	// Subscribe to topic
	if token := client.Subscribe(topic, 2, messagePubHandler); token.Wait() && token.Error() != nil {
		log.Println(token.Error())
		return nil
	}
	log.Printf("Subscribed to topic: %s\n", topic)

	return client
}

func main() {
	// Load .env variables
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	tlsConfig, err := config.LoadClientTLSFromEnv("DESKTOP_CRT", "DESKTOP_KEY", "NEW_CA_CRT")
	if err != nil {
		log.Fatal(err)
	}

	// Connect to Apache Kafka
	broker, ok := os.LookupEnv("KAFKA_BROKER_ADDRESS")
	if !ok {
		log.Fatal("failed to retrieve kafka broker address")
	}

	kafkaWriter := &kafka.Writer{
		Addr:     kafka.TCP(broker),
		Topic:    "text-chunks",
		Balancer: &kafka.LeastBytes{}, // routes to the least congested partition
	}
	defer kafkaWriter.Close()

	client := connectToMQTTBroker(tlsConfig, kafkaWriter)
	defer client.Disconnect(250)
	go startGRPCServer(client)

	count := 0
	for {
		text := fmt.Sprintf("Message %d", count)
		token := client.Publish("test/topic", 2, false, text)
		token.Wait()
		log.Printf("Published message: %s\n", text)
		time.Sleep(time.Second * 2)
		count++
	}
}
