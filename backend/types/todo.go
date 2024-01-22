package types

type CreateTodoParams struct {
	TodoListId uint `uri:"todoListId" binding:"required"`
}

type UpdateTodoParams struct {
	CreateTodoParams
	TodoId uint `uri:"todoId" binding:"required"`
}

type UpdateTodoCompletedParams struct {
	UpdateTodoParams
}

type UpdateTodoCompletedBody struct {
	Completed bool `form:"completed" binding:"required"`
}

type DeleteTodoParams struct {
	UpdateTodoParams
}

type CreateTodoBody struct {
	Title 			string  `form:"title" binding:"required,min=2,max=64"`
	Description 	string  `form:"title" binding:"required,min=2,max=1000"`
	Completed 		bool    `form:"completed"`
	CategoryId 		uint 	`form:"categoryId" binding:"required"`
}

type UpdateTodoBody struct {
	CreateTodoBody
}