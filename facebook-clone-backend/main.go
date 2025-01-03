package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Post struct {
	ID      int    `json:"id"`
	UserID  int    `json:"user_id"`
	Content string `json:"content"`
}

var users []User
var posts []Post
var userIDCounter = 1
var postIDCounter = 1

func main() {
	router := gin.Default()

	router.Use(corsMiddleware())

	router.POST("/register", register)
	router.POST("/login", login)
	router.POST("/insecure-login", login)
	router.POST("/post", createPost)
	router.GET("/posts", getPosts)
	router.GET("/health", healthCheck)
	// Vulnerable endpoint for SQL Injection
	router.GET("/user/:username", getUserByUsername)

	// Vulnerable endpoint for XSS
	router.GET("/greet", greetUser)

	// Vulnerable endpoint for logging user input
	router.POST("/log-input", logUserInput)
	router.Run(":3402")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func register(c *gin.Context) {
	var newUser User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newUser.ID = userIDCounter
	userIDCounter++
	users = append(users, newUser)
	c.JSON(http.StatusOK, newUser)
}

func login(c *gin.Context) {
	var loginUser User
	if err := c.ShouldBindJSON(&loginUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for _, user := range users {
		if user.Username == loginUser.Username && user.Password == loginUser.Password {
			c.JSON(http.StatusOK, user)
			return
		}
	}
	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
}

func loginUserInsecure(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"url": "http://insecure-api.com/login"}) // HTTP used for a login URL
}

func createPost(c *gin.Context) {
	var newPost Post
	if err := c.ShouldBindJSON(&newPost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	newPost.ID = postIDCounter
	postIDCounter++
	posts = append(posts, newPost)
	c.JSON(http.StatusOK, newPost)
}

func getPosts(c *gin.Context) {
	c.JSON(http.StatusOK, posts)
}

func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "healthy"})
}

// Vulnerable to SQL Injection
func getUserByUsername(c *gin.Context) {
	username := c.Param("username")
	db, err := sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/dbname")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}
	defer db.Close()

	query := fmt.Sprintf("SELECT id, username, password FROM users WHERE username = '%s'", username)
	row := db.QueryRow(query)

	var user User
	if err := row.Scan(&user.ID, &user.Username, &user.Password); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// Vulnerable to XSS
func greetUser(c *gin.Context) {
	name := c.Query("name")
	c.String(http.StatusOK, fmt.Sprintf("<p>Hello, %s!</p>", name)) // Explicit HTML response
}

// Vulnerable to logging user input
func logUserInput(c *gin.Context) {
	var input map[string]string
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Logging user input directly
	log.Println("User input:", input["message"])

	c.JSON(http.StatusOK, gin.H{"status": "logged"})
}
