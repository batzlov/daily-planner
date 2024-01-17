package controllers

import (
	"daily-planner-api/initializers"
	"daily-planner-api/models"
	"daily-planner-api/utils"
	"fmt"

	"net/http"

	"github.com/gin-gonic/gin"
)

func GetTodoLists(context *gin.Context) {
	currentUser := utils.GetCurrentUser(context)
	
	var todoLists []models.TodoList
	initializers.DATABASE.Where("created_by = ?", currentUser.ID).Preload("Todos").Find(&todoLists)

	context.JSON(http.StatusOK, gin.H {
		"data": todoLists,
	})
}

func GetTodoListById(context *gin.Context) {
	var params struct {
		TodoListId uint `uri:"todoListId" binding:"required"`
	}

	if err := context.ShouldBindUri(&params); err != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": err.Error(),
		})

		return		
	}

	currentUser := utils.GetCurrentUser(context)

	var todoList models.TodoList
	initializers.DATABASE.Where("id = ? AND created_by = ?", params.TodoListId, currentUser.ID).Preload("Todos").Find(&todoList)

	if todoList.ID == 0  {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})

		return
	}

	context.JSON(http.StatusOK, gin.H {
		"data": todoList,
	})
}

func CreateTodoList(context *gin.Context) {
	var body struct {
		Title string `form:"title" binding:"required,min=3,max=64"`
	}
	
	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": err.Error(),
		})
		
		return
	}

	currentUser := utils.GetCurrentUser(context)

	todoListToCreate := models.TodoList{
		Title: body.Title,
		CreatedBy: currentUser.ID,
	}

	initializers.DATABASE.Save(&todoListToCreate)

	context.JSON(http.StatusCreated, gin.H {})
}

func UpdateTodoList(context *gin.Context) {
	var params struct {
		TodoListId 	uint `uri:"todoListId" binding:"required"`
	}
	var body struct {
		Title 		string `form:"title" binding:"required,min=3,max=64"`
	}

	// first of all check for valid uri parameters
	paramsErr := context.ShouldBindUri(&params)
	if paramsErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-uri",
			"message": "Invalid uri, please check the provided uri.",
			"details": paramsErr.Error(),
		})
		
		return
	}

	// then check for valid body parameters
	bodyErr := context.ShouldBindJSON(&body)
	if bodyErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": bodyErr.Error(),
		})
		
		return
	}

	currentUser := utils.GetCurrentUser(context)

	var todoListToUpdate models.TodoList
	initializers.DATABASE.Where(
		"id = ? AND created_by = ?", 
		params.TodoListId, 
		currentUser.ID,
	).First(&todoListToUpdate)


	if todoListToUpdate.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})

		return
	}
	
	todoListToUpdate.Title = body.Title
	initializers.DATABASE.Save(&todoListToUpdate)

	context.JSON(http.StatusOK, gin.H {
		"data": todoListToUpdate,
	})
}

func DeleteTodoList(context *gin.Context) {
	var params struct {
		TodoListId 	uint `uri:"todoListId" binding:"required"`
	}

	paramsErr := context.ShouldBindUri(&params)
	if paramsErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-uri",
			"message": "Invalid uri, please check the provided uri.",
			"details": paramsErr.Error(),
		})
		
		return
	}

	currentUser := utils.GetCurrentUser(context)
	var todoListToDelete models.TodoList
	
	initializers.DATABASE.Where("id = ? AND created_by = ?", params.TodoListId, currentUser.ID).First(&todoListToDelete)

	if todoListToDelete.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})

		return
	}

	initializers.DATABASE.Delete(&todoListToDelete)

	context.JSON(http.StatusOK, gin.H {})
}

func ReorderTodoList(context *gin.Context) {
	var params struct {
		TodoListId 	uint `uri:"todoListId" binding:"required"`
	}
	var body struct {
		Todos 		[]models.Todo `form:"todos" binding:"required,nn"`
	}

	paramsErr := context.ShouldBindUri(&params)
	if paramsErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-uri",
			"message": "Invalid uri, please check the provided uri.",
			"details": paramsErr.Error(),
		})
		
		return
	}

	bodyErr := context.ShouldBindJSON(&body)
	if bodyErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": bodyErr.Error(),
		})
		
		return
	}

	currentUser := utils.GetCurrentUser(context)
	var todoListToUpdate models.TodoList
	initializers.DATABASE.Where("id = ? AND created_by = ?", params.TodoListId, currentUser.ID).Preload("Todos").First(&todoListToUpdate)

	if todoListToUpdate.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})

		return
	}

	if len(body.Todos) != len(todoListToUpdate.Todos) {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": "The number of todos in the body does not match the number of todos in the database.",
		})
		
		return	
	}

	for _, todo := range body.Todos {
		for secondIndex, todoToUpdate := range todoListToUpdate.Todos {
			if todo.ID == todoToUpdate.ID {
				todoListToUpdate.Todos[secondIndex].Order = todo.Order
			}
		}
	}

	initializers.DATABASE.Save(&todoListToUpdate)

	context.JSON(http.StatusOK, gin.H {
		"data": todoListToUpdate,
	})
}

func ShareTodoListWith(context *gin.Context) {}
func UnshareTodoListWith(context *gin.Context) {}