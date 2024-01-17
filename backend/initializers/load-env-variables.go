package initializers

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	error := godotenv.Load()

	if error != nil {
		log.Fatal("Error loading the .env file, please check if the file exists.")
	}
}