package models

type Category struct {
	GormModel
	Title     			string 		`gorm:"not null" json:"title"`

	CreatedBy 			uint   		`json:"createdBy"`
}