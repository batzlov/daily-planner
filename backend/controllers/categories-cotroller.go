package controllers

import (
	"daily-planner-api/initializers"
	"daily-planner-api/models"
	"daily-planner-api/types"
	"daily-planner-api/utils"
	"net/http"

	"fmt"

	"github.com/gin-gonic/gin"
)

func GetCategories(context *gin.Context) {
	currentUser := utils.GetCurrentUser(context)

	var categories []models.Category
	initializers.DATABASE.Where("created_by = ? OR created_by = 0", currentUser.ID).Find(&categories)

	context.JSON(http.StatusOK, gin.H {
		"data": categories,
	})
}

func CreateCategory(context *gin.Context) {
	var body types.CreateCategoryBody

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": err.Error(),
		})

		return
	}

	currentUser := utils.GetCurrentUser(context)
	categoryToCreate := models.Category{
		Title: body.Title,
		CreatedBy: currentUser.ID,
	}

	initializers.DATABASE.Create(&categoryToCreate)

	context.JSON(http.StatusCreated, gin.H {
		"data": categoryToCreate,
	})
}

func UpdateCategory(context *gin.Context) {
	var params types.UpdateCategoryParams
	paramsErr := context.ShouldBindUri(&params)
	if(paramsErr != nil) {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": paramsErr.Error(),
		})

		return
	}

	var body types.UpdateCategoryBody
	bodyErr := context.ShouldBindJSON(&body)
	if bodyErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": bodyErr.Error(),
		})

		return
	}

	var categoryToUpdate models.Category
	initializers.DATABASE.Where("id = ?", params.CategoryId).First(&categoryToUpdate)
	if categoryToUpdate.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No Category found with the given id: %d.", params.CategoryId),
			"details": nil,
		})

		return
	}

	// check if the created_by is 0, if so it means that it's a default category and can't be updated
	if categoryToUpdate.CreatedBy == 0 {
		context.JSON(http.StatusNotAcceptable, gin.H {
			"code": "default-categories-can-not-be-updated",
			"message": "This is a default category and can't be updated.",
			"details": nil,
		})

		return
	}

	currentUser := utils.GetCurrentUser(context)
	if categoryToUpdate.CreatedBy != currentUser.ID {
		context.JSON(http.StatusForbidden, gin.H {
			"code": "forbidden",
			"message": "You are not allowed to update this category.",
			"details": nil,
		})

		return
	}

	categoryToUpdate.Title = body.Title
	initializers.DATABASE.Save(&categoryToUpdate)

	context.JSON(http.StatusOK, gin.H {
		"data": categoryToUpdate,
	})
}

func DeleteCategory(context *gin.Context) {
	var params types.DeleteCategoryParams
	paramsErr := context.ShouldBindUri(&params)
	if paramsErr != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-parameters",
			"message": "Invalid parameters, please check the provided data.",
			"details": paramsErr.Error(),
		})

		return
	}

	var categoryToDelete models.Category
	initializers.DATABASE.Where("id = ?", params.CategoryId).First(&categoryToDelete)
	if categoryToDelete.ID == 0 {
		context.JSON(http.StatusNotFound, gin.H {
			"code": "not-found",
			"message": fmt.Sprintf("No Category found with the given id: %d.", params.CategoryId),
			"details": nil,
		})

		return
	}

	// check if the created_by is 0, if so it means that it's a default category and can't be deleted
	if categoryToDelete.CreatedBy == 0 {
		context.JSON(http.StatusNotAcceptable, gin.H {
			"code": "default-categories-can-not-be-deleted",
			"message": "This is a default category and can't be deleted.",
			"details": nil,
		})

		return
	}

	currentUser := utils.GetCurrentUser(context)
	if categoryToDelete.CreatedBy != currentUser.ID {
		context.JSON(http.StatusForbidden, gin.H {
			"code": "forbidden",
			"message": "You are not allowed to delete this category.",
			"details": nil,
		})

		return
	}

	// check if there are any todos with this category
	var todos []models.Todo
	initializers.DATABASE.Where("category_id = ?", categoryToDelete.ID).Find(&todos)

	if len(todos) > 0 {
		context.JSON(http.StatusNotAcceptable, gin.H {
			"code": "invalid-parameters",
			"message": fmt.Sprintf("There are %d todos with this category, please delete them first.", len(todos)),
			"details": nil,
		})

		return
	}

	initializers.DATABASE.Delete(&categoryToDelete)

	context.JSON(http.StatusOK, gin.H {})
}