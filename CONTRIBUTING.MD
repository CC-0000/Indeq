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
3. You're going to need 1 `.env` file in the **/common/config** folder with all your variables and a `root_ca.crt` CA certificate that will be given to you separately (should be in private channels)
4. Because of new TLS configurations, you MUST add the `root_ca.crt` file to any request making software you use.
   - For Firefox:
     1. Navigate to **about:config**
     2. Make sure `security.enterprise_roots.enabled` is set to `true`
     3. Navigate to **about:preferences#privacy**
     4. Click **View Certificates**
     5. Go to **Authorities**
     6. Import `root_ca.crt`
     7. When prompted, set the purpose to `Identify Websites`
   - For Postman:
     1. Go to **Settings** in the top right corner
     2. Go to **Certificates**
     3. Toggle `CA Certificates` to be `on`
     4. Next to `PEM file`, select and choose `root_ca.crt`
   - For other software, just search up "*how to add a trusted CA certificate in <software_of_choice>*"
5. Run `docker-compose up --build` to run the services in docker containers
6. Run `docker-compose down` to spin down your containers afterwards (optionally use the `-v` flag to clear all databases and data)
7. Run `docker exec <container_name> ollama pull <model_name>` to download and set up the model (you should only need to do this once). The default should be `docker exec backend_ollama_1 ollama pull deepseek-r1:1.5b`

#### New Services

1. Create a new folder for your service
2. Run `go mod init` to create a new module.
3. Create a `main.go` file for your code
4. Create a `*.proto` file in **/common/api/** for your gRPC endpoints
5. Add your module to the `go.work` file

#### Troubleshooting

- If docker isn't running, try `sudo dockerd` to run it manually or `systemctl restart docker` if you have it set to run in the background.
- If you're running into go mod issues try running `go work sync` in the **/backend** folder
- If your containers are having issues and/or unexpected behavior, try entering one of them by running:
  `docker exec -it <name_of_running_container> bash` while your container is running
- For postgresql containers, `psql -U <postgres_username>` will open the postgres terminal
- If you are running into CORS issues, make sure you have your CA certificate set up correctly and add your frontend IP to the .env file


### Frontend

### Root

#### Prerequisities

- node
- npm

#### Setup

1. Run `npm i` in `Indeq/` directory to install husky and commitlint

### Production
#### Misc Notes
- Before deploying to production, make sure to change all necessary variables in the `.env` file to support production deployments. This includes:
  - database urls, strings, usernames, passwords
  - rabbitMQ urls, strings, usernames, passwords
  - TLS certificates, CA certificates, server-side TLS key,crt pairs
  - CORS allowed IP addresses
  - Individual service IP addresses
