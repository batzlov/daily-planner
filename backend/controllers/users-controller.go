package controllers

import (
	"daily-planner-api/initializers"
	"daily-planner-api/models"
	"daily-planner-api/types"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(context *gin.Context) {
	var body types.SignUpBody
	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": err.Error(),
		})

		return
	}

	var userWithMailAlreadyExists models.User
	result := initializers.DATABASE.Where("email = ?", body.Email).Find(&userWithMailAlreadyExists)

	if result.Error != nil || userWithMailAlreadyExists.ID > 0 {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "mail-already-used",
			"message": "The provided mail is already in use.",
		})

		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "hashing-password-failed",
			"message": "Failed to generate password hash.",
			"details": err.Error(),
		})

		return
	}

	userToCreate := models.User{
		Email: body.Email,
		FirstName: body.FirstName,
		LastName: body.LastName,
		Password: string(passwordHash),
	}

	result = initializers.DATABASE.Create(&userToCreate)

	if result.Error != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "creating-user-failed",
			"message": "Failed to create user.",
			"details": result.Error.Error(),
		})

		return
	}

	context.JSON(http.StatusCreated, gin.H {})
}

func SignIn(context *gin.Context) {
	var body types.SignInBody
	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-body",
			"message": "Invalid body, please check the provided data.",
			"details": err.Error(),
		})

		return
	}

	var user models.User
	result := initializers.DATABASE.Where("email = ?", body.Email).First(&user)

	if result.Error != nil || user.ID == 0 {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-credentials",
			"message": "The provided credentials are invalid.",
			"details": result.Error.Error(),
		})

		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "invalid-credentials",
			"message": "The provided credentials are invalid.",
			"details": err.Error(),
		})

		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"subject": user.ID,
		"expiresAt": time.Now().Add(time.Hour * 24).Unix(),	
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H {
			"code": "token-generation-failed",
			"message": "Failed to generate token.",
			"details": err.Error(),
		})

		return
	}

	// set cookie for authorization
	context.SetSameSite(http.SameSiteLaxMode)
	context.SetCookie("Authorization", tokenString, 3600 * 24, "", "", false, true)

	context.JSON(http.StatusCreated, gin.H {
		"jwt": tokenString,
		"jwtExpiresAt": time.Now().Add(time.Hour * 24).Unix(),
		"user": user,
	})
}

func SignOut(context *gin.Context) {
	context.SetSameSite(http.SameSiteLaxMode)
	context.SetCookie("Authorization", "", -1, "", "", false, true)

	context.JSON(http.StatusOK, gin.H {})
}