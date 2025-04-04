package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

type TokenInfo struct {
	Scope     string `json:"scope"`
	Error     string `json:"error"`
	ErrorDesc string `json:"error_description"`
}

// ValidateAccessToken validates an access token for a specific platform
func ValidateAccessToken(accessToken, platform string) ([]string, error) {
	if platform == "GOOGLE" {
		tokenInfo, err := validateGoogleAccessToken(accessToken)
		if err != nil {
			fmt.Printf("Error validating Google access token: %v\n", err)
			return nil, err
		}
		scopes := strings.Split(tokenInfo.Scope, " ")
		return scopes, nil
	}

	if platform == "NOTION" {
		tokenInfo, err := validateNotionAccessToken(accessToken)
		if err != nil {
			fmt.Printf("Error validating Notion access token: %v\n", err)
			return nil, err
		}
		scopes := strings.Split(tokenInfo.Scope, " ")
		return scopes, nil
	}

	return nil, fmt.Errorf("unsupported platform: %s", platform)
}

// retryWithBackoff retries a function with exponential backoff and jitter
func retryWithBackoff(attempts int, baseDelay time.Duration, fn func() error) error {
	var err error
	for i := 0; i < attempts; i++ {
		if i > 0 {
			sleep := baseDelay * (1 << i)
			jitter := time.Duration(rand.Intn(1000)) * time.Millisecond
			time.Sleep(sleep + jitter)
		}

		if err = fn(); err == nil {
			return nil
		}
		fmt.Printf("Attempt %d failed: %v\n", i+1, err)
	}
	return fmt.Errorf("all %d attempts failed: %v", attempts, err)
}

// validateGoogleAccessToken validates a Google access token with retries
func validateGoogleAccessToken(accessToken string) (*TokenInfo, error) {
	url := fmt.Sprintf("https://oauth2.googleapis.com/tokeninfo?access_token=%s", accessToken)

	client := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			TLSHandshakeTimeout: 20 * time.Second,
			IdleConnTimeout:     90 * time.Second,
		},
	}

	var tokenInfo TokenInfo
	err := retryWithBackoff(3, 1*time.Second, func() error {
		resp, err := client.Get(url)
		if err != nil {
			return fmt.Errorf("request failed: %w", err)
		}
		defer resp.Body.Close()

		if err := json.NewDecoder(resp.Body).Decode(&tokenInfo); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}

		if tokenInfo.Error != "" {
			return fmt.Errorf("invalid token: %s - %s", tokenInfo.Error, tokenInfo.ErrorDesc)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}
	return &tokenInfo, nil
}

// validateNotionAccessToken validates a Notion access token with retries
func validateNotionAccessToken(accessToken string) (*TokenInfo, error) {
	url := "https://api.notion.com/v1/users/me"
	client := &http.Client{}

	var tokenInfo TokenInfo
	err := retryWithBackoff(3, 1*time.Second, func() error {
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return err
		}

		req.Header.Set("Authorization", "Bearer "+accessToken)
		req.Header.Set("Notion-Version", "2022-06-28")

		resp, err := client.Do(req)
		if err != nil {
			return fmt.Errorf("request failed: %w", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return fmt.Errorf("invalid Notion access token, status: %d", resp.StatusCode)
		}

		tokenInfo.Scope = "*"
		return nil
	})

	if err != nil {
		return nil, err
	}
	return &tokenInfo, nil
}
