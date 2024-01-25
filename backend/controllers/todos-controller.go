package controllers

import (
	"daily-planner-api/initializers"
	"daily-planner-api/models"
	"daily-planner-api/types"
	"daily-planner-api/utils"
	"errors"

	"fmt"
	"net/http"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)



func CreateTodo(context *gin.Context) {
	var params types.CreateTodoParams
	paramsErr := context.ShouldBindUri(&params)
	if(paramsErr != nil) {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": paramsErr.Error(),
		})

		return
	}

	var body types.CreateTodoBody
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

	var category models.Category
	initializers.DATABASE.Where("id = ?", body.CategoryId).First(&category)
	if category.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No Category found with the given id: %d", body.CategoryId),
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
		CategoryID: body.CategoryId,
		Category: category,
	}	
	initializers.DATABASE.Model(&todoList).Association("Todos").Append(&todoToCreate)

	context.JSON(http.StatusCreated, gin.H {
		"data": todoList,
	})
}

func UpdateTodo(context *gin.Context) {
	var params types.UpdateTodoParams
	paramsErr := context.ShouldBindUri(&params)
	if(paramsErr != nil) {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": paramsErr.Error(),
		})

		return
	}

	var body types.UpdateTodoBody
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
	initializers.DATABASE.Where("id = ? AND created_by = ?", params.TodoListId, currentUser.ID).First(&todoListToUpdate)

	if todoListToUpdate.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})

		return
	}
	
	var todoToUpdate models.Todo
	initializers.DATABASE.Where("id = ? AND todo_list_id = ?", params.TodoId, params.TodoListId).First(&todoToUpdate)
	if todoToUpdate.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No Todo found with the given id: %d", params.TodoId),
			"details": nil,
		})

		return
	}

	var category models.Category
	initializers.DATABASE.Where("id = ?", body.CategoryId).First(&category)
	if category.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No Category found with the given id: %d", body.CategoryId),
			"details": nil,
		})
		return;
	}

	todoToUpdate.Title = body.Title
	todoToUpdate.Description = body.Description
	todoToUpdate.Completed = body.Completed
	todoToUpdate.CategoryID = body.CategoryId
	todoToUpdate.Category = category

	initializers.DATABASE.Save(&todoToUpdate)

	context.JSON(http.StatusOK, gin.H {
		"data": todoToUpdate,
	})
}

func UpdateTodoCompleted(context *gin.Context) {
	var params types.UpdateTodoCompletedParams
	paramsErr := context.ShouldBindUri(&params)
	if(paramsErr != nil) {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": paramsErr.Error(),
		})

		return
	}

	var body types.UpdateTodoCompletedBody
	bodyErr := context.ShouldBindJSON(&body)
	if bodyErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": bodyErr.Error(),
		})

		return
	}

	var todoToUpdate models.Todo
	var todoListToUpdate models.TodoList
	currentUser := utils.GetCurrentUser(context)
	
	initializers.DATABASE.Where("id = ? AND created_by = ?", params.TodoListId, currentUser.ID).First(&todoListToUpdate)
	if todoListToUpdate.ID == 0 {
		// if the user is not the creator of the todo list, check if the todo list is shared with the user
		err := initializers.DATABASE.Table("share_todo_list_with_users").Where("todo_list_id = ? AND user_id = ?", params.TodoListId, currentUser.ID).First(&todoListToUpdate).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			context.JSON(http.StatusNotFound, gin.H {
				"code": "not-found",
				"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
				"details": nil,
			})

			return
		}
	}

	initializers.DATABASE.Where("id = ? AND todo_list_id = ?", params.TodoId, params.TodoListId).First(&todoToUpdate)
	if todoToUpdate.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No Todo found with the given id: %d", params.TodoId),
			"details": nil,
		})

		return
	}

	todoToUpdate.Completed = body.Completed
	initializers.DATABASE.Save(&todoToUpdate)

	context.JSON(http.StatusOK, gin.H {
		"data": todoToUpdate,
	})
	
}

func DeleteTodo(context *gin.Context) {
	var params types.DeleteTodoParams
	paramsErr := context.ShouldBindUri(&params)
	if(paramsErr != nil) {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": paramsErr.Error(),
		})

		return
	}

	currentUser := utils.GetCurrentUser(context)
	var todoListToDeleteFrom models.TodoList
	initializers.DATABASE.Where("id = ? AND created_by = ?", params.TodoListId, currentUser.ID).First(&todoListToDeleteFrom)
	if todoListToDeleteFrom.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})

		return
	}


	var todoToDelete models.Todo
	initializers.DATABASE.Where("id = ? AND todo_list_id = ?", params.TodoId, params.TodoListId).First(&todoToDelete)
	if todoToDelete.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No Todo found with the given id: %d", params.TodoId),
			"details": nil,
		})

		return
	}

	initializers.DATABASE.Delete(&todoToDelete)

	context.JSON(http.StatusOK, gin.H {})
}