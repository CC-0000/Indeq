# Load the YAML file and extract the data section
$data = yq eval '.data | to_entries' .\backend-config.yaml

# Check if any secrets were found
if ($data.Count -eq 0) {
    Write-Host "No secrets found in backend-config.yaml."
    exit
}

# Loop through each secret
foreach ($secret in $data) {
    # Extract the raw secret string
    $rawSecret = $secret

    # Trim the string and extract key and value
    $trimmedSecret = $rawSecret.Trim()
    $keyValue = $trimmedSecret -replace '^- key: ', '' -split ': '

    # Extract the key and value
    $name = $keyValue[0].Trim()  # This will be the key
    $value = $keyValue[1].Trim()  # This will be the value if it exists

    # Debug output to check the extracted values
    Write-Host "Extracted secret: Name='$name', Value='$value'"

    # Check if the value is empty or commented out
    if (-not $value -or $value -match '^\s*#') {
        Write-Host "Warning: The value for secret '$name' is empty or commented out. Skipping..."
        continue
    }

    # Output the secret being set
    Write-Host "Setting secret: $name"

    # Set the secret in GitHub
    gh secret set $name --body $value

    # Confirm the secret was set
    Write-Host "Secret $name has been set."
}