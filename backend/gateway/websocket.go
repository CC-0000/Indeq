package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	pb "github.com/cc-0000/indeq/common/api"
	"github.com/lxzan/gws"
	"github.com/segmentio/kafka-go"
	"google.golang.org/protobuf/proto"
)

type WSHandler struct {
	clients *ServiceClients
	userId  string
}

func (h *WSHandler) OnOpen(socket *gws.Conn) {
	// Set an initial deadline for the connection
	socket.SetDeadline(time.Now().Add(60 * time.Second))
}

func (h *WSHandler) OnClose(socket *gws.Conn, err error) {}

func (h *WSHandler) OnPing(socket *gws.Conn, payload []byte) {
	// Update deadline when ping is received
	socket.SetDeadline(time.Now().Add(60 * time.Second))
	socket.WritePong(nil)
}

func (h *WSHandler) OnPong(socket *gws.Conn, payload []byte) {}

func (h *WSHandler) OnMessage(socket *gws.Conn, message *gws.Message) {
	defer message.Close()

	log.Printf("Received message: %s", string(message.Bytes()))

	var request pb.HttpTextSyncRequest
	if err := json.Unmarshal(message.Bytes(), &request); err != nil {
		log.Printf("Incoming websocket message is not in the right format: %v", err)
		return
	}

	kafkaMessage := &pb.TextChunkMessage{
		Metadata: &pb.TextChunkMessage_Metadata{
			UserId: h.userId,
		},
		Content: request.Text,
	}

	byteEncodedKafkaMessage, err := proto.Marshal(kafkaMessage)
	if err != nil {
		log.Printf("Failed to serialize incoming message: %v", err)
		return
	}
	if err := h.clients.kafkaWriter.WriteMessages(context.Background(),
		kafka.Message{
			Value: byteEncodedKafkaMessage,
		},
	); err != nil {
		log.Printf("Failed to write to kafka: %v", err)
		return
	}

	// Echo the message back
	response := &pb.HttpTextSyncResponse{
		Success: true,
	}
	res, err := json.Marshal(response)
	if err != nil {
		log.Printf("Failed to serialize incoming message: %v", err)
		return
	}
	socket.WriteMessage(2, res)
}
