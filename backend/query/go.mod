module github.com/cc-0000/indeq/query

go 1.23.5

require (
	github.com/joho/godotenv v1.5.1 // indirect
	google.golang.org/grpc v1.70.0
)

require (
	golang.org/x/net v0.32.0 // indirect
	golang.org/x/sys v0.29.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20241202173237-19429a94021a // indirect
	google.golang.org/protobuf v1.35.2 // indirect
)

require (
	github.com/cc-0000/indeq/common v0.0.0
	github.com/rabbitmq/amqp091-go v1.10.0
)

replace github.com/cc-0000/indeq/common => ../common
