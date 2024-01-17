package utils

import (
	"daily-planner-api/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetCurrentUser(context *gin.Context) *models.User {
	userFromContext, _ := context.Get("user")

	var user models.User
	if u, ok := userFromContext.(models.User); ok {
		user = u
	}

	return &user
}

func StringToUint(number string) uint {
	i, _ := strconv.Atoi(number)

	return uint(i)
}