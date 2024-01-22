package initializers

import "daily-planner-api/models"

func SyncDatabase() {
	// uncomment when needed
	// DATABASE.Migrator().DropTable("users")
	// DATABASE.Migrator().DropTable("todo_lists")
	// DATABASE.Migrator().DropTable("todos")
	// DATABASE.Migrator().DropTable("categories")

	DATABASE.AutoMigrate(
		&models.User{}, 
		&models.TodoList{}, 
		&models.Todo{},
		&models.Category{},
	)
}