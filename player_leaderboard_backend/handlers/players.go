package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"player-leaderboard-backend/cache"
	"player-leaderboard-backend/db"
	"player-leaderboard-backend/models"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/gin-gonic/gin"
)

func CreatePlayer(c *gin.Context) {
	var player models.Player

	if err := c.ShouldBindJSON(&player); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if player.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name is required"})
		return
	}

	if player.Score < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Score must be >= 0"})
		return
	}

	query := `INSERT INTO players(name,score) VALUES ($1, $2) RETURNING id, name, score, created_at,updated_at`

	ctx := c.Request.Context()
	row := db.Pool.QueryRow(ctx, query, player.Name, player.Score)

	err := row.Scan(&player.ID, &player.Name, &player.Score, &player.CreatedAt, &player.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"player":  player,
	})

}

func GetPlayers(c *gin.Context) {
	rows, err := db.Pool.Query(context.Background(), "SELECT id, name, score FROM players")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching players Players"})
		return
	}
	defer rows.Close()

	var players []models.Player

	for rows.Next() {
		var player models.Player

		err := rows.Scan(&player.ID, &player.Name, &player.Score)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error Scanning players"})
			return
		}
		players = append(players, player)

	}

	
if players == nil {
    players = []models.Player{}
}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"players": players,
	})
}

func UpdateScore(c *gin.Context) {
	id := c.Param("id")

	var player models.Player

	if err := c.ShouldBindJSON(&player); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if player.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please Input player name"})
		return
	}

	if player.Score <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please input player score"})
	}

	query := `UPDATE players SET name = $1, score = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name,score, updated_at`
	ctx := c.Request.Context()
	row := db.Pool.QueryRow(ctx, query, player.Name, player.Score, id)
	err := row.Scan(&player.ID, &player.Name, &player.Score, &player.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Item updated sucessfully.",
	})

}

func DeletePlayer(c *gin.Context) {
	id := c.Param("id")
	var player models.Player

	query := `DELETE FROM players WHERE id = $1 RETURNING id,name, score;`
	row := db.Pool.QueryRow(context.Background(),query,id)
	err := row.Scan(&player.ID, &player.Name, &player.Score)

	if err != nil{
		if errors.Is(err, pgx.ErrNoRows){
			c.JSON(http.StatusNotFound, gin.H{"error": "Player not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success":true,
		"message": "Player record deleted sucessfully!",
	})

}


func GetStats(c *gin.Context)     {
	ctx := context.Background()

	//Check Redis cache first
	cached, err := cache.Client.Get(ctx, "stats").Result()
	if err == nil{
		c.Data(http.StatusOK, "application/json", []byte(cached))
		return
	}

	//Cache miss - query database
	var totalPlayers int
	var highestScore int
	var averageScore float64

	err = db.Pool.QueryRow(ctx, `
	SELECT
	COUNT(*) as total_players,
	COALESCE(MAX(score), 0) as highest_score,
	COALESCE(AVG(score), 0) as average_score
	FROM players
	`).Scan(&totalPlayers, &highestScore, &averageScore)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	stats := gin.H{
		"success":true,
		"total_players": totalPlayers,
		"highest_score": highestScore,
		"average_score": averageScore,
	}

	//Save to Redis for 30 seconds
	jsonStats, _ := json.Marshal(stats)
	cache.Client.Set(ctx, "stats", jsonStats, 30*time.Second)

	c.JSON(http.StatusOK,stats)


}
