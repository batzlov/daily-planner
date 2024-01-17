package models

type Todo struct {
	GormModel
	Title     		string `gorm:"not null" json:"title"`
	Description 	string `gorm:"not null" json:"description"`
	Completed 		bool   `gorm:"not null default:false" json:"completed"`
	Order	   		uint    `gorm:"not null" json:"order"`
	TodoListID 		uint   `gorm:"not null" json:"todoListId"`
}

type CreateTodoParams struct {
	TodoListId uint `uri:"todoListId" binding:"required"`
}

type UpdateTodoParams struct {
	CreateTodoParams
	TodoId uint `uri:"todoId" binding:"required"`
}

type DeleteTodoParams struct {
	UpdateTodoParams
}

type CreateTodoBody struct {
	Title 			string `form:"title" binding:"required,min=2,max=64"`
	Description 	string `form:"title" binding:"required,min=2,max=1000"`
	Completed 		bool   `form:"completed"`
}

type UpdateTodoBody struct {
	CreateTodoBody
}