module github.com/cc-0000/indeq/gateway

go 1.23.5

require google.golang.org/grpc v1.70.0

require (
	github.com/cespare/xxhash/v2 v2.3.0 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/redis/go-redis/v9 v9.7.1 // indirect
	golang.org/x/net v0.32.0 // indirect
	golang.org/x/sys v0.29.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20241202173237-19429a94021a // indirect
	google.golang.org/protobuf v1.35.2 // indirect
)

require (
	github.com/cc-0000/indeq/common v0.0.0
	github.com/golang/protobuf v1.5.4
	github.com/google/uuid v1.6.0
	github.com/rabbitmq/amqp091-go v1.10.0
)

replace (
	github.com/cc-0000/indeq/common => ../common
	github.com/cc-0000/indeq/query => ../query
)
