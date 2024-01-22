package types

import "daily-planner-api/models"

type GetTodoListByIdParams struct {
	TodoListId uint `uri:"todoListId" binding:"required"`
}

type CreateTodoListBody struct {
	Title 			string  `form:"title" binding:"required,min=3,max=64"`
}

type UpdateTodoListParams struct {
	TodoListId uint `uri:"categoryId" binding:"required"`
}

type UpdateTodoListBody struct {
	CreateTodoListBody
}

type DeleteTodoListParams struct {
	TodoListId uint `uri:"categoryId" binding:"required"`
}

type ReorderTodoListParams struct {
	TodoListId uint `uri:"todoListId" binding:"required"`
}

type ReorderTodoListBody struct {
	Todos []models.Todo `form:"todos" binding:"required"`
}

type ShareTodoListWithParams struct {
	TodoListId uint `uri:"todoListId" binding:"required"`
}

type ShareTodoListWithBody struct {
	ShareWithMail 		string `json:"email" binding:"required,email"`
}

type UnshareTodoListWithParams struct {
	TodoListId uint `uri:"todoListId" binding:"required"`
	UserId uint `uri:"userId" binding:"required"`
}

