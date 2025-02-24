package config

import (
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func LoadSharedConfig() error {
    envPath := ".env"
    return godotenv.Load(envPath)
}

func LoadTLSFromEnv(certEnvName string, keyEnvName string) (*tls.Config, error) {
    // Decode cert and key from env vars
    certPEM, err := base64.StdEncoding.DecodeString(os.Getenv(certEnvName))
    if err != nil {
        return nil, fmt.Errorf("failed to decode cert: %v", err)
    }
    
    keyPEM, err := base64.StdEncoding.DecodeString(os.Getenv(keyEnvName))
    if err != nil {
        return nil, fmt.Errorf("failed to decode key: %v", err)
    }

    // Load the key pair
    cert, err := tls.X509KeyPair(certPEM, keyPEM)
    if err != nil {
        return nil, fmt.Errorf("failed to load key pair: %v", err)
    }

    return &tls.Config{
        Certificates: []tls.Certificate{cert},
        MinVersion:  tls.VersionTLS13,
    }, nil
}
 
