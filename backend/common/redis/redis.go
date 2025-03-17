package redis

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	Client *redis.Client
}

func NewRedisClient(ctx context.Context, addr string) (*RedisClient, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr: addr,
		Password: "",
		DB: 0,
	})

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to ping redis: %w", err)
	}

	return &RedisClient{Client: rdb}, nil
}

func (c *RedisClient) StoreOAuthState(ctx context.Context, state string, userId string) error {
	log.Println("Storing oauth state: ", state, userId)
    key := fmt.Sprintf("oauth:state:%s", state)
    err := c.Client.Set(ctx, key, userId, 5*time.Minute).Err()
	if err != nil {
		return fmt.Errorf("failed to store oauth state: %w", err)
	}
    log.Printf("Stored oauth state in redis: %s -> %s", key, userId)   
	return nil
}

func (c *RedisClient) ValidateOAuthState(ctx context.Context, state string) (string, error) {
    key := fmt.Sprintf("oauth:state:%s", state)

    userId, err := c.Client.Get(ctx, key).Result()
    if err == redis.Nil {
        return "", fmt.Errorf("state not found or expired")
    }
    if err != nil {
        return "", fmt.Errorf("could not get state from Redis: %w", err)
    }

    delCount, err := c.Client.Del(ctx, key).Result()
    if err != nil {
        return "", fmt.Errorf("could not delete state from Redis: %w", err)
    }
    if delCount == 0 {
        return "", fmt.Errorf("state key was not deleted (key may not exist)")
    } else {
		log.Printf("Deleted state %s from Redis for user %s", key, userId)
	}

    return userId, nil
}

