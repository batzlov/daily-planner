package initializers

import "daily-planner-api/models"

func SyncDatabase() {
	DATABASE.AutoMigrate(
		&models.User{}, 
		&models.TodoList{}, 
		&models.Todo{},
		&models.Category{},
	)
}