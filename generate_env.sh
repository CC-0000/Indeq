#!/bin/bash

# Create .env files in the specified directories
echo "Creating .env files..."

# Define the directories
declare -a dirs=("backend/gateway" "backend/authentication" "backend/query", "backend/common/config")

# Loop through each directory and create the .env file
for dir in "${dirs[@]}"; do
    echo "Creating .env in $dir"
    {
        echo "AUTH_PORT=${{ secrets.AUTH_PORT }}"
        echo "AUTH_ADDRESS=${{ secrets.AUTH_ADDRESS }}"
        echo "QUERY_PORT=${{ secrets.QUERY_PORT }}"
        echo "QUERY_ADDRESS=${{ secrets.QUERY_ADDRESS }}"
        echo "VECTOR_PORT=${{ secrets.VECTOR_PORT }}"
        echo "VECTOR_ADDRESS=${{ secrets.VECTOR_ADDRESS }}"
        echo "GATEWAY_ADDRESS=${{ secrets.GATEWAY_ADDRESS }}"

        # Database parameters
        echo "DATABASE_URL=${{ secrets.DATABASE_URL }}"
        echo "POSTGRES_USER=${{ secrets.POSTGRES_USER }}"
        echo "POSTGRES_PASSWORD=${{ secrets.POSTGRES_PASSWORD }}"
        echo "POSTGRES_DB=${{ secrets.POSTGRES_DB }}"

        echo "JWT_SECRET=${{ secrets.JWT_SECRET }}"

        # Argon2 Parameters
        echo "ARGON2_MEMORY=${{ secrets.ARGON2_MEMORY }}"
        echo "ARGON2_ITERATIONS=${{ secrets.ARGON2_ITERATIONS }}"
        echo "ARGON2_PARALLELISM=${{ secrets.ARGON2_PARALLELISM }}"
        echo "ARGON2_SALT_LENGTH=${{ secrets.ARGON2_SALT_LENGTH }}"
        echo "ARGON2_KEY_LENGTH=${{ secrets.ARGON2_KEY_LENGTH }}"

        # Password and Email Constraints
        echo "MIN_PASSWORD_LENGTH=${{ secrets.MIN_PASSWORD_LENGTH }}"
        echo "MAX_PASSWORD_LENGTH=${{ secrets.MAX_PASSWORD_LENGTH }}"
        echo "MAX_EMAIL_LENGTH=${{ secrets.MAX_EMAIL_LENGTH }}"

        # RabbitMQ parameters
        echo "RABBITMQ_URL=${{ secrets.RABBITMQ_URL }}"
        echo "RABBITMQ_DEFAULT_USER=${{ secrets.RABBITMQ_DEFAULT_USER }}"
        echo "RABBITMQ_DEFAULT_PASS=${{ secrets.RABBITMQ_DEFAULT_PASS }}"
        echo "RABBITMQ_LOGS=${{ secrets.RABBITMQ_LOGS }}"

        # Ollama parameters
        echo "OLLAMA_URL=${{ secrets.OLLAMA_URL }}"
        echo "LLM_MODEL=${{ secrets.LLM_MODEL }}"

        # Zilliz parameters
        echo "ZILLIZ_ADDRESS=${{ secrets.ZILLIZ_ADDRESS }}"
        echo "ZILLIZ_API_KEY=${{ secrets.ZILLIZ_API_KEY }}"

        # TLS parameters in base 64
        echo "CA_CRT=${{ secrets.CA_CRT }}"
        echo "QUERY_CRT=${{ secrets.QUERY_CRT }}"
        echo "QUERY_KEY=${{ secrets.QUERY_KEY }}"
        echo "AUTH_CRT=${{ secrets.AUTH_CRT }}"
        echo "AUTH_KEY=${{ secrets.AUTH_KEY }}"
        echo "GATEWAY_CRT=${{ secrets.GATEWAY_CRT }}"
        echo "GATEWAY_KEY=${{ secrets.GATEWAY_KEY }}"

        # CORS parameters
        echo "ALLOWED_CLIENT_IP=${{ secrets.ALLOWED_CLIENT_IP }}"
    } > "$dir/.env"
done

echo ".env files created successfully."