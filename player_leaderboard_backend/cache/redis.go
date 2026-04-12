package cache

import (
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var Client *redis.Client

func Connect(){
	opt, err := redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil{
		log.Fatal("Failed to parse Redis URL:", err)
	}

	Client = redis.NewClient(opt)
	log.Println("Connected to Redis")


}

