package main

import (
	"os"
	"os/signal"
	"syscall"

	"github.com/cc-0000/indeq/common/config"
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/mochi-mqtt/server/v2/hooks/auth"

	"log"

	"github.com/mochi-mqtt/server/v2/listeners"
)

func main() {
	// Load .env variables
	err := config.LoadSharedConfig()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Configure TLS
	tlsConfig, err := config.LoadServerTLSFromEnv("MQTT_CRT", "MQTT_KEY")
	if err != nil {
		log.Print(err)
		log.Fatal("Error loading TLS config for mqtt service")
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
	err = server.AddHook(new(auth.AllowHook), nil)
	if err != nil {
		log.Fatal(err)
	}

	// // Create TCP listener on port 1883
	// tcp := listeners.NewTCP(listeners.Config{
	// 	ID:      "tcp1",
	// 	Address: ":1883",
	// })

	// Create TLS listener on port 8883
	tlsTCP := listeners.NewTCP(listeners.Config{
		ID:        "ssl1",
		Address:   ":8883",
		TLSConfig: tlsConfig,
	})

	// Add listeners to the server
	// err = server.AddListener(tcp)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	err = server.AddListener(tlsTCP)
	if err != nil {
		log.Fatal(err)
	}

	// Start the broker
	go func() {
		err = server.Serve()
		if err != nil {
			log.Fatal(err)
		}
	}()

	<-done
}
