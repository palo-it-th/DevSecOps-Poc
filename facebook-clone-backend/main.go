package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
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

	router.POST("/register", register)
	router.POST("/login", login)
	router.POST("/post", createPost)
	router.GET("/posts", getPosts)

	router.Run(":8080")
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
