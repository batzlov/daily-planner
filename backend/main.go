package main

import (
	"daily-planner-api/core"
	"daily-planner-api/initializers"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDatabase()
	initializers.SyncDatabase()
}

func main() {
	router := core.Router()
	router.Run()
}