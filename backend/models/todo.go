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