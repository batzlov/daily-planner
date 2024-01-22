package core

import (
	"daily-planner-api/controllers"
	"daily-planner-api/middleware"

	"github.com/gin-gonic/gin"

	"github.com/gin-contrib/cors"
)

func Router() *gin.Engine {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AddAllowHeaders("Authorization")
  	router.Use(cors.New(config))

	router.POST("/sign-up", controllers.SignUp)
	router.POST("/sign-in", controllers.SignIn)
	
	router.GET("/categories", middleware.RequireAuth, controllers.GetCategories)
	router.POST("/categories", middleware.RequireAuth, controllers.CreateCategory)
	router.PUT("/categories/:categoryId", middleware.RequireAuth, controllers.UpdateCategory)
	router.DELETE("/categories/:categoryId", middleware.RequireAuth, controllers.DeleteCategory)

	router.POST("/todo-lists/:todoListId/todos", middleware.RequireAuth, controllers.CreateTodo)
	router.POST("/todo-lists/:todoListId/reorder-todos", middleware.RequireAuth, controllers.ReorderTodoList)
	router.PUT("/todo-lists/:todoListId/todos/:todoId/update-completed", middleware.RequireAuth, controllers.UpdateTodoCompleted)
	router.PUT("/todo-lists/:todoListId/todos/:todoId", middleware.RequireAuth, controllers.UpdateTodo)
	router.DELETE("/todo-lists/:todoListId/todos/:todoId", middleware.RequireAuth, controllers.UpdateTodo)
	
	router.GET("/todo-lists", middleware.RequireAuth, controllers.GetTodoLists)
	router.GET("/todo-lists/:todoListId", middleware.RequireAuth, controllers.GetTodoListById)
	router.POST("/todo-lists", middleware.RequireAuth, controllers.CreateTodoList)
	router.PUT("/todo-lists/:todoListId", middleware.RequireAuth, controllers.UpdateTodoList)
	router.DELETE("/todo-lists/:todoListId", middleware.RequireAuth, controllers.DeleteTodoList)
	router.POST("/todo-lists/:todoListId/share-with", middleware.RequireAuth, controllers.ShareTodoListWith)
	router.DELETE("/todo-lists/:todoListId/unshare-with", middleware.RequireAuth, controllers.UnshareTodoListWith)

	return router
}