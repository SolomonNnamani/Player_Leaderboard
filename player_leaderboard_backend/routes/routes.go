package routes

import (
	"player-leaderboard-backend/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/players", handlers.CreatePlayer)
	r.GET("/players", handlers.GetPlayers)
	r.PATCH("/players/:id", handlers.UpdateScore)
	r.DELETE("/players/:id", handlers.DeletePlayer)
	r.GET("/players/stats", handlers.GetStats)
}
