package config

import (
	"github.com/joho/godotenv"
)

func LoadSharedConfig() error {
    envPath := ".env"
    return godotenv.Load(envPath)
}