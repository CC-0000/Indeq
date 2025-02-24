# Get the list of services defined in the docker-compose.yml
$services = docker-compose config --services

# Loop through each service
foreach ($service in $services) {
    # Tag the image
    Write-Host "$service"

}
