package main

import (
	"context"
	"crypto/tls"
	"database/sql"
	"fmt"
	"maps"
	"slices"

	// "fmt"
	"log"
	"net"
	"os"
	"time"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/cc-0000/indeq/common/config"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/lib/pq"
	"github.com/segmentio/kafka-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/protobuf/proto"
)

type desktopServer struct {
	pb.UnimplementedDesktopServiceServer
	mqttClient  mqtt.Client
	db          *sql.DB
	kafkaWriter *kafka.Writer
}

func (s *desktopServer) GetChunksFromUser(ctx context.Context, req *pb.GetChunksFromUserRequest) (*pb.GetChunksFromUserResponse, error) {
	return nil, nil
}

func (s *desktopServer) startGRPCServer() {
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
	pb.RegisterDesktopServiceServer(grpcServer, s)
	log.Printf("Desktop gRPC Service listening on %v\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	} else {
		log.Printf("Desktop gRPC Service served on %v\n", listener.Addr())
	}
}

func (s *desktopServer) connectToDatabase() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	// Connect to database
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Set up database tables
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_, err = db.ExecContext(ctx, `
			CREATE TABLE IF NOT EXISTS crawl_stats (
				user_id UUID PRIMARY KEY,
				online BOOLEAN NOT NULL,
				crawling BOOLEAN NOT NULL,
				crawled_files SMALLINT,
				total_files SMALLINT
			);

			CREATE TABLE IF NOT EXISTS indexed_files (
				user_id UUID NOT NULL,
				file_path TEXT NOT NULL,
				hash VARCHAR(255) NOT NULL,
				done BOOLEAN
			);
		`)
	if err != nil {
		log.Fatalf("Failed to create tables: %v", err)
	}

	// _, err = db.ExecContext(ctx, `
	// 		CREATE INDEX IF NOT EXISTS email_idx ON users(email)
	// 	`)
	// if err != nil {
	// 	log.Fatalf("Failed to create email index: %v", err)
	// }
	s.db = db
}

// Deletes a list of files corresponding to a certain user
func batchDeleteFilepaths(ctx context.Context, tx *sql.Tx, userID string, toKeepHashes []string) error {
	_, err := tx.ExecContext(ctx, `
        DELETE FROM indexed_files
        WHERE user_id = $1 AND hash NOT IN (SELECT unnest($2::text[]))
    `, userID, pq.Array(toKeepHashes))
	if err != nil {
		return fmt.Errorf("failed to execute delete query: %v", err)
	}
	return nil
}

func batchUpdateIndexedFiles(ctx context.Context, tx *sql.Tx, userID string, updates map[string]string) error {
	updateStmt, err := tx.PrepareContext(ctx, `
		UPDATE indexed_files
		SET file_path = $3
		WHERE user_id = $1 AND file_path = $2
		AND hash = (SELECT hash FROM indexed_files WHERE file_path = $3)
	`)
	if err != nil {
		return err
	}
	defer updateStmt.Close()

	// Execute batch updates
	for oldPath, newPath := range updates {
		_, err = updateStmt.ExecContext(ctx, userID, oldPath, newPath)
		if err != nil {
			return err
		}
	}

	return nil
}

func batchInsertFilepaths(ctx context.Context, tx *sql.Tx, userID string, newFiles []string, newHashes []string) error {
	_, err := tx.ExecContext(ctx, `
        INSERT INTO indexed_files (user_id, file_path, hash, done)
        SELECT $1, unnest($2::text[]), unnest($3::varchar[]), false
    `, userID, pq.Array(newFiles), pq.Array(newHashes))
	if err != nil {
		return fmt.Errorf("failed to execute insert query: %v", err)
	}
	return nil
}

func (s *desktopServer) handleCrawlRequest(client mqtt.Client, msg mqtt.Message) {

	// HARD CODES (remove later)
	userID := "b1e7c1b1-cd79-49bf-92fa-70f6be41533b"

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	log.Printf("Received message from topic: %s\n", msg.Topic())
	newCrawl := &pb.NewCrawl{}
	if err := proto.Unmarshal([]byte(msg.Payload()), newCrawl); err != nil {
		return
	}
	// log.Print(newCrawl.GetFilePaths())
	// log.Print(newCrawl.GetFileHashes())
	newFilePaths := newCrawl.GetFilePaths()
	newFileHashes := newCrawl.GetFileHashes()
	hashToPath := make(map[string]string) // hash --> file_path
	pathToHash := make(map[string]string) // file_path --> hash
	for i := range newFilePaths {
		hashToPath[newFileHashes[i]] = newFilePaths[i]
		pathToHash[newFilePaths[i]] = newFileHashes[i]
	}
	fileRename := make(map[string]string) // file_path --> file_path
	toKeep := make(map[string]string)     // hash --> file_path
	var needToReqFiles []string
	var needToReqHashes []string

	// 1.) get all the files from the database
	rows, err := s.db.QueryContext(ctx, `SELECT file_path, hash, done FROM indexed_files WHERE user_id = $1`, userID)
	if err != nil {
		log.Printf("failed to query indexed files: %s", err)
	}
	defer rows.Close()

	// go through all the old files
	for rows.Next() {
		var oldFilePath, oldHash string
		var done bool
		if err := rows.Scan(&oldFilePath, &oldHash, &done); err != nil {
			log.Printf("failed to scan row: %s", err)
		}

		if _, ok := hashToPath[oldHash]; ok && done {
			if oldFilePath != hashToPath[oldHash] {
				fileRename[oldFilePath] = hashToPath[oldHash]
			}
			toKeep[oldHash] = hashToPath[oldHash]
		}
	}

	// go through all the new files
	for _, newHash := range newFileHashes {
		if _, ok := toKeep[newHash]; !ok {
			// this file hash is not one of the one we kept so fetch new
			needToReqFiles = append(needToReqFiles, hashToPath[newHash])
			needToReqHashes = append(needToReqHashes, newHash)
		}
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		log.Printf("failed to begin transaction: %s", err)
	}
	defer tx.Rollback()

	// delete unnecessary files
	toKeepHashes := slices.Collect(maps.Keys(toKeep))
	if err = batchDeleteFilepaths(ctx, tx, userID, toKeepHashes); err != nil {
		log.Printf("failed to delete files: %s", err)
	}

	// update any file names that use the same hash
	if err = batchUpdateIndexedFiles(ctx, tx, userID, fileRename); err != nil {
		log.Printf("failed to update file names: %s", err)
	}

	// set up new files to be uploaded
	if err = batchInsertFilepaths(ctx, tx, userID, needToReqFiles, needToReqHashes); err != nil {
		log.Printf("failed to create empty upload entries: %s", err)
	}

	// TODO: update the crawl_stats database

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		log.Printf("failed to commit transaction: %s", err)
	}

	if err = s.makeCrawlRequest(needToReqFiles, needToReqHashes); err != nil {
		log.Print(err)
	}
}

func (s *desktopServer) makeCrawlRequest(needToReqFiles []string, needToReqHashes []string) error {
	crawlReq := &pb.NewCrawl{
		FilePaths:  needToReqFiles,
		FileHashes: needToReqHashes,
	}

	payload, err := proto.Marshal(crawlReq)
	if err != nil {
		return fmt.Errorf("failed to serialize the crawl request: %v", err)
	}

	s.mqttClient.Publish("crawl_req/1234", 2, false, payload)

	return nil
}

func (s *desktopServer) handleChunk(client mqtt.Client, msg mqtt.Message) {
	ctx := context.Background()
	log.Printf("Received message from topic: %s\n", msg.Topic())

	// unmarshal to check validity
	if err := proto.Unmarshal([]byte(msg.Payload()), &pb.TextChunkMessage{}); err != nil {
		log.Print(err)
		return
	}

	message := kafka.Message{
		Value: msg.Payload(),
	}

	if err := s.kafkaWriter.WriteMessages(ctx, message); err != nil {
		log.Print(err)
		return
	}
}

func (s *desktopServer) handleFileDoneRequest(client mqtt.Client, msg mqtt.Message) {
	userID := "b1e7c1b1-cd79-49bf-92fa-70f6be41533b"
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	log.Printf("Received message from topic: %s\n", msg.Topic())
	fileDoneMessage := &pb.FileDoneMessage{}
	if err := proto.Unmarshal([]byte(msg.Payload()), fileDoneMessage); err != nil {
		return
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		log.Printf("failed to begin transaction: %s", err)
	}
	defer tx.Rollback()

	// update file to done
	if _, err = tx.ExecContext(ctx, `
		UPDATE indexed_files
		SET done = true
		WHERE user_id = $1 AND file_path = $2
	`, userID, fileDoneMessage.FilePath); err != nil {
		log.Print(err)
		return
	}

	// TODO: update % done counter

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		log.Printf("failed to commit transaction: %s", err)
	}

}

func (s *desktopServer) connectToMQTTBroker(tlsConfig *tls.Config) {
	mqttAddress := os.Getenv("MQTT_ADDRESS")
	clientID := "desktop_mqtt_client"

	// Connection handler
	connectHandler := func(client mqtt.Client) {
		log.Println("Connected to mqtt broker")
	}

	// Connection lost handler
	connectLostHandler := func(client mqtt.Client, err error) {
		log.Printf("Mqtt broker connection lost: %v\n", err)
	}

	// Create client options
	opts := mqtt.NewClientOptions()
	opts.SetTLSConfig(tlsConfig)
	opts.AddBroker(mqttAddress)
	opts.SetClientID(clientID)
	// opts.SetDefaultPublishHandler(handleCrawlRequest)
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
	topic := "new_crawl/1234"
	if token := client.Subscribe(topic, 2, s.handleCrawlRequest); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}
	log.Printf("Subscribed to topic: %s\n", topic)

	topic = "new_chunk/1234"
	if token := client.Subscribe(topic, 2, s.handleChunk); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}
	log.Printf("Subscribed to topic: %s\n", topic)

	topic = "file_done/1234"
	if token := client.Subscribe(topic, 2, s.handleFileDoneRequest); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}
	log.Printf("Subscribed to topic: %s\n", topic)

	s.mqttClient = client
}

func (s *desktopServer) connectToKafka() {
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

	s.kafkaWriter = kafkaWriter
}

func main() {
	// Load .env variables
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	clientTlsConfig, err := config.LoadClientTLSFromEnv("DESKTOP_CRT", "DESKTOP_KEY", "NEW_CA_CRT")
	if err != nil {
		log.Fatal(err)
	}

	server := &desktopServer{}

	// Connect to the Desktop Database
	server.connectToDatabase()

	// Connect to Apache Kafka
	server.connectToKafka()

	// Connect to the MQTT Broker
	server.connectToMQTTBroker(clientTlsConfig)
	defer server.mqttClient.Disconnect(250) // Add disconnect here instead
	defer server.db.Close()

	// start the gRPC server
	go server.startGRPCServer()

	count := 0
	for {
		text := fmt.Sprintf("Message %d", count)
		token := server.mqttClient.Publish("receive_file/1234", 2, false, text)
		token.Wait()
		log.Printf("Published message: %s\n", text)
		time.Sleep(time.Second * 2)
		count++
	}
}
