package middleware

import (
	"daily-planner-api/initializers"
	"daily-planner-api/models"
	"daily-planner-api/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequireTodoListAccess(context *gin.Context) {
	// TODO: validate that the id form the todo list is a valid uint and the user is allowed to access the list
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
	initializers.DATABASE.Where("id = ?", params.TodoListId).Find(&todoList)

	if todoList.ID == 0  {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No TodoList found with the given id: %d", params.TodoListId),
			"details": nil,
		})
	}

	if todoList.CreatedBy != currentUser.ID {
		context.JSON(http.StatusForbidden, gin.H {
			"code": "forbidden",
			"message": fmt.Sprintf("You have no rights to access the todo list with the given id: %d", params.TodoListId),
			"details": nil,
		})
	}

	// TODO: in the future the user wants to share his todo list with other users

	context.Next()
}