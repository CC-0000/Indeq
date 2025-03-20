package main

import (
	"github.com/cc-0000/indeq/common/config"
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/mochi-mqtt/server/v2/listeners"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	// Load .env variables
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Configure TLS
	tlsConfig, err := config.LoadMTLSFromEnv("MQTT_CRT", "MQTT_KEY", "CA_CRT")
	if err != nil {
		log.Fatalf("Error loading TLS config for mqtt service: %v", err)
	}

	sigs := make(chan os.Signal, 1)
	done := make(chan bool, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		done <- true
	}()

	// Create a new MQTT Server instance
	server := mqtt.New(nil)
	defer server.Close()

	// Add the auth hook to allow connections
	certHook := NewCertAuthHook()
	err = server.AddHook(certHook, nil)
	if err != nil {
		log.Fatalf("failed to add certificate hook to mqtt server: %v", err)
	}

	// Create TLS listener on port 8883
	tlsTCP := listeners.NewTCP(listeners.Config{
		ID:        "ssl1",
		Address:   ":8883",
		TLSConfig: tlsConfig,
	})

	err = server.AddListener(tlsTCP)
	if err != nil {
		log.Fatalf("failed to add TLS listener to mqtt server: %v", err)
	}

	go func() {
		err = server.Serve()
		if err != nil {
			log.Fatalf("encountered an error while serving the mqtt server: %v", err)
		}
	}()

	<-done
}
