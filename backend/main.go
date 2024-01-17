package main

import (
	"daily-planner-api/controllers"
	"daily-planner-api/initializers"
	"daily-planner-api/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDatabase()
	initializers.SyncDatabase()
}

func main() {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AddAllowHeaders("Authorization")
  	router.Use(cors.New(config))

	router.POST("/sign-up", controllers.SignUp)
	router.POST("/sign-in", controllers.SignIn)
	
	router.POST("/todo-lists/:todoListId/todos", middleware.RequireAuth, controllers.CreateTodo)
	router.PUT("/todo-lists/:todoListId/todos/:todoId", middleware.RequireAuth, controllers.UpdateTodo)
	router.DELETE("/todo-lists/:todoListId/todos/:todoId", middleware.RequireAuth, controllers.UpdateTodo)
	
	router.GET("/todo-lists", middleware.RequireAuth, controllers.GetTodoLists)
	router.GET("/todo-lists/:todoListId", middleware.RequireAuth, controllers.GetTodoListById)
	router.POST("/todo-lists", middleware.RequireAuth, controllers.CreateTodoList)
	router.PUT("/todo-lists/:todoListId", middleware.RequireAuth, controllers.UpdateTodoList)
	router.DELETE("/todo-lists/:todoListId", middleware.RequireAuth, controllers.DeleteTodoList)
	
	router.Run()
}