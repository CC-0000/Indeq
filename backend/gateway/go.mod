module github.com/cc-0000/indeq/gateway

go 1.23.5

replace (
	github.com/cc-0000/indeq/authentication => ../authentication
	github.com/cc-0000/indeq/common => ../common
	github.com/cc-0000/indeq/query => ../query
)

require (
	github.com/cc-0000/indeq/common v0.0.0-00010101000000-000000000000
	github.com/google/uuid v1.6.0
	github.com/rabbitmq/amqp091-go v1.10.0
	google.golang.org/grpc v1.70.0
)

require (
	github.com/joho/godotenv v1.5.1 // indirect
	golang.org/x/net v0.34.0 // indirect
	golang.org/x/sys v0.30.0 // indirect
	golang.org/x/text v0.22.0 // indirect
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
