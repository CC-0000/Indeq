module github.com/cc-0000/indeq/mqtt

go 1.23.5

replace github.com/cc-0000/indeq/common => ../common

require (
	github.com/cc-0000/indeq/common v0.0.0-00010101000000-000000000000
	github.com/mochi-mqtt/server/v2 v2.7.7
)

require (
	github.com/gorilla/websocket v1.5.0 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/rs/xid v1.4.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
