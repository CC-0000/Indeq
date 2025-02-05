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
3. You're going to need 1 `.env` file in the `/common/config` folder with all your variables
4. Run `docker-compose up --build` to run the services in docker containers
5. Run `docker-compose down` to spin down your containers afterwards (optionally use the `-v` flag to clear all databases and data)

#### Troubleshooting

- If docker isn't running, try `sudo dockerd` to run it manually or `systemctl restart docker` if you have it set to run in the background.
- If you're running into go mod issues try running `go work sync` in the `/backend` folder
- If your containers are having issues and/or unexpected behavior, try entering one of them by running:
  `docker exec -it <name_of_running_container> bash` while your container is running

- For postgresql containers, `psql -U <postgres_username>` will open the postgres terminal

### Frontend
