package controllers

import (
	"daily-planner-api/initializers"
	"daily-planner-api/models"
	"daily-planner-api/utils"

	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)



func CreateTodo(context *gin.Context) {
	var params models.CreateTodoParams
	paramsErr := context.ShouldBindUri(&params)
	if(paramsErr != nil) {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": paramsErr.Error(),
		})
	}

	var body models.CreateTodoBody
	bodyErr := context.ShouldBindJSON(&body)
	if bodyErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": bodyErr.Error(),
		})

		return
	}

	// get the current highest order number
	var todoList models.TodoList
	var highestOrderTodo models.Todo
	currentUser := utils.GetCurrentUser(context)
	initializers.DATABASE.Where("id = ? AND created_by = ?", params.TodoListId, currentUser.ID).Preload("Todos").First(&todoList)
	if todoList.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})

		return
	}

	initializers.DATABASE.Order("todos.order DESC").Where("todo_list_id = ?", params.TodoListId).Find(&highestOrderTodo)
	var currentlyHighestOrder uint
	if(highestOrderTodo.Order == 0) {
		currentlyHighestOrder = 0
	} else {
		currentlyHighestOrder = highestOrderTodo.Order
	}

	// add the new todo to the list
	todoToCreate := models.Todo{
		Title: body.Title,
		Description: body.Description,
		Completed: body.Completed,
		Order: currentlyHighestOrder + 1,
		TodoListID: params.TodoListId,
	}
	todoList.Todos = append(todoList.Todos, todoToCreate)
	
	initializers.DATABASE.Save(&todoToCreate)

	context.JSON(http.StatusCreated, gin.H {
		"data": todoList,
	})
}

func UpdateTodo(context *gin.Context) {
	var params models.UpdateTodoParams
	paramsErr := context.ShouldBindUri(&params)
	if(paramsErr != nil) {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": paramsErr.Error(),
		})
	}

	var body models.UpdateTodoBody
	bodyErr := context.ShouldBindJSON(&body)
	if bodyErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": bodyErr.Error(),
		})
	}

	currentUser := utils.GetCurrentUser(context)
	
	var todoListToUpdate models.TodoList
	initializers.DATABASE.Where("id = ? AND created_by = ?", params.TodoListId, currentUser.ID).First(&todoListToUpdate)

	if todoListToUpdate.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})
	}
	
	var todoToUpdate models.Todo
	initializers.DATABASE.Where("id = ? AND todo_list_id = ?", params.TodoId, params.TodoListId).Preload("TodoList").First(&todoToUpdate)
	if todoToUpdate.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No Todo found with the given id: %d", params.TodoId),
			"details": nil,
		})

		return
	}

	todoToUpdate.Title = body.Title
	todoToUpdate.Description = body.Description
	todoToUpdate.Completed = body.Completed

	initializers.DATABASE.Save(&todoToUpdate)

	context.JSON(http.StatusOK, gin.H {
		"data": todoToUpdate,
	})
}

func DeleteTodo(context *gin.Context) {
	todoListId := utils.StringToUint(context.Param("id"))
	todoId := utils.StringToUint(context.Param("todoId"))

	var todoToDelete models.Todo
	result := initializers.DATABASE.Where("id = ? AND todo_list_id = ?", todoId, todoListId).First(&todoToDelete)

	if result.Error != nil {
		context.JSON(http.StatusNotFound, gin.H {
			"code": 8,
			"message": "Todo not found.",
		})

		return
	}

	result = initializers.DATABASE.Delete(&todoToDelete)

	if result.Error != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": 8,
			"message": "Failed to delete todo.",
		})

		return
	}

	context.JSON(http.StatusOK, gin.H {})
}

func ShareTodosWith(context *gin.Context) {}

func GetSharedTodos(context *gin.Context) {}