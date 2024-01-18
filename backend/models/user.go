package models

type User struct {
	GormModel
	
	Email    					string 		`gorm:"unique;not null" json:"email"`
	FirstName 					string 		`gorm:"not null" json:"firstName"`
	LastName 					string 		`gorm:"not null" json:"lastName"`
	Password 					string 		`gorm:"not null" json:"password"`

	TodoLists 					[]TodoList   `gorm:"foreignKey:CreatedBy" json:"todoLists"`
	SharedTodoLists 			[]*TodoList  `gorm:"many2many:share_todo_list_with_users;" json:"sharedTodoLists"`
}