package main

import (
	
	"os"
	"player-leaderboard-backend/cache"
	"player-leaderboard-backend/db"
	"player-leaderboard-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/joho/godotenv"
)

func main() {
	 godotenv.Load()
	
	allowedOrigin := os.Getenv("API_URL")

	db.Connect()
	cache.Connect()

	r:= gin.Default()

	//for cors
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{allowedOrigin},
		AllowMethods: []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
	}))



	routes.SetupRoutes(r)
	r.Run(":8080")
}
