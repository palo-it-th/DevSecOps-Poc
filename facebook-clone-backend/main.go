package main

import (
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

// Vulnerable to XSS
func greetUser(c *gin.Context) {
	name := c.Query("name")
	c.String(http.StatusOK, "Hello, "+name) // Unsanitized user input
}
