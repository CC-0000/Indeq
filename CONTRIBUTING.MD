## Contribution Guide

Here you will find all the necessary information for developers to install and set up this project on their system

### Backend

#### Prerequisites

- golang v1.23.5
- protobuf compiler
- ability to run make files
- docker daemon (_remember to run it!_)

#### Setup

1. Download the repository
2. Run `make gen` in the **/common** folder
3. Make sure you have the necessary environment variables and/or `.env` files
4. Run `go run .` in individual service folders (_e.g. gateway, query, etc_)
5. Optionally, you can run `docker-compose up --build` to run the services in docker containers

### Frontend
