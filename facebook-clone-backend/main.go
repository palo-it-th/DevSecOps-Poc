package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"net/http"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"is_admin"`
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
var db *sql.DB

func main() {
	router := gin.Default()
	var err error
	db, err = sql.Open("sqlite3", "./test.db")
	if err != nil {
		fmt.Printf("Error opening database: %q\n", err)
	}
	defer db.Close()

	// Create users table
	_, cErr := db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT,
		password TEXT,
		is_admin INTEGER
	)`)
	if cErr != nil {
		fmt.Printf("Error creating users table: %q\n", cErr)
	}

	router.Use(corsMiddleware())

	router.POST("/register", register)
	router.POST("/login", loginWithSQLInjection)
	router.POST("/insecure-login", loginWithSQLInjection)
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
	//newUser.ID = userIDCounter
	//userIDCounter++
	//users = append(users, newUser)
	query := "INSERT INTO users (username, password, is_admin) VALUES ('" + newUser.Username + "', '" + newUser.Password + "', 0)"
	_, err := db.Exec(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	c.JSON(http.StatusOK, newUser)
}

func loginWithSQLInjection(c *gin.Context) {
	var loginUser User
	if err := c.ShouldBindJSON(&loginUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// SQL Injection Vulnerability: Directly concatenating user input into the query
	query := "SELECT id, username, password, is_admin FROM users WHERE username = '" + loginUser.Username + "' AND password = '" + loginUser.Password + "'"
	row := db.QueryRow(query)

	var user User
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.IsAdmin)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": user})
}

//func login(c *gin.Context) {
//	var loginUser User
//	if err := c.ShouldBindJSON(&loginUser); err != nil {
//		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//		return
//	}
//	for _, user := range users {
//		if user.Username == loginUser.Username && user.Password == loginUser.Password {
//			c.JSON(http.StatusOK, user)
//			return
//		}
//	}
//	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
//}

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
