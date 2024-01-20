package models

type Todo struct {
	GormModel
	Title     		string 		`gorm:"not null" json:"title"`
	Description 	string 		`gorm:"not null" json:"description"`
	Completed 		bool   		`gorm:"not null default:false" json:"completed"`
	Order	   		uint   		`gorm:"not null" json:"order"`

	TodoListID 		uint   		`gorm:"not null" json:"todoListId"`
	CategoryID 		uint   		`gorm:"not null" json:"categoryId"`
	Category 		Category	`gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"category"`
}

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