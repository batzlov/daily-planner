package models

type TodoList struct {
	GormModel
	Title     			string 		`gorm:"not null" json:"title"`
	Deleted 			bool   		`gorm:"not null default:false" json:"deleted"`

	Todos 				[]Todo 		`json:"todos"`
	CreatedBy 			uint   		`gorm:"not null" json:"createdBy"`
	SharedWith 			[]*User 	`gorm:"many2many:share_todo_list_with_users;" json:"sharedWith"`
}