# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache protobuf-dev git make
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest 
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Copy module files first
COPY go.work go.work.sum ./
COPY gateway/go.mod gateway/go.sum ./gateway/
COPY common/go.mod common/go.sum ./common/
COPY query/go.mod query/go.sum ./query/
COPY authentication/go.mod authentication/go.sum ./authentication/
COPY waitlist/go.mod waitlist/go.sum ./waitlist/
COPY crawling/go.mod crawling/go.sum ./crawling/

# Download dependencies
RUN cd query && go mod download

# Copy proto files
COPY common/api/query.proto ./common/api/
RUN protoc --go_out=. --go-grpc_out=. common/api/query.proto

# Copy source code
COPY query/ ./query/
COPY common/ ./common/

# Build binary with module replacement
RUN cd query && \
    CGO_ENABLED=0 GOOS=linux go build -o ../query-service .

# Runtime stage  
FROM alpine:latest
RUN apk --no-cache add ca-certificates

WORKDIR /app/
COPY --from=builder /app/query-service .
COPY --from=builder /app/common/config/.env . 

EXPOSE 50051
CMD ["./query-service"]
