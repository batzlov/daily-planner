package models

type TodoList struct {
	GormModel
	Title     			string 		`gorm:"not null" json:"title"`

	Todos 				[]Todo 		`json:"todos"`
	CreatedBy 			uint   		`gorm:"not null" json:"createdBy"`
}