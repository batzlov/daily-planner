package middleware

import (
	"daily-planner-api/initializers"
	"daily-planner-api/models"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func extractBearerToken(header string) (string, error) {
	if header == "" {
		return "", errors.New("no authorization header provided")
	}

	jwtToken := strings.Split(header, " ")
	if len(jwtToken) != 2 {
		return "", errors.New("authorization header is not in the correct format")
	}

	return jwtToken[1], nil
}


func RequireAuth(context *gin.Context) {
	// first of all check if a cookie is set
	tokenString, err := context.Cookie("Authorization")

	if err != nil {
		// if no cookie is set, check if a bearer token is provided
		err = nil
		tokenString, err = extractBearerToken(context.GetHeader("Authorization"))

		if err != nil {
			context.AbortWithStatus(http.StatusUnauthorized)
			return;
		}
		
		fmt.Println("using jwt auth")
	} else {
		fmt.Println("using cookie auth")
	}

	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {	
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		
		return []byte(os.Getenv("SECRET")), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if time.Now().Unix() > int64(claims["expiresAt"].(float64)) {
			context.SetSameSite(http.SameSiteLaxMode)
			context.SetCookie("Authorization", "", -1, "", "", false, true)
			context.AbortWithStatus(http.StatusUnauthorized)
		} else {
			var user models.User
			initializers.DATABASE.First(&user, int(claims["subject"].(float64)))

			if user.ID == 0 {
				context.AbortWithStatus(http.StatusUnauthorized)
			}

			context.Set("user", user)

			context.Next()
		}
	} else {
		context.AbortWithStatus(http.StatusUnauthorized)
	}
}
// func RequireAuth(context *gin.Context) {
// 	// get token from cookie or token from bearer header
// 	tokenString, err := context.Cookie("Authorization")

// 	if err != nil {
// 		context.AbortWithStatus(http.StatusUnauthorized)
// 		return;
// 	}

// 	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
// 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {	
// 			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
// 		}
		
// 		return []byte(os.Getenv("SECRET")), nil
// 	})

// 	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
// 		if time.Now().Unix() > int64(claims["expiresAt"].(float64)) {
// 			context.SetSameSite(http.SameSiteLaxMode)
// 			context.SetCookie("Authorization", "", -1, "", "", false, true)
// 			context.AbortWithStatus(http.StatusUnauthorized)
// 		} else {
// 			var user models.User
// 			initializers.DATABASE.First(&user, int(claims["subject"].(float64)))

// 			if user.ID == 0 {
// 				context.AbortWithStatus(http.StatusUnauthorized)
// 			}

// 			context.Set("user", user)

// 			context.Next()
// 		}
// 	} else {
// 		context.AbortWithStatus(http.StatusUnauthorized)
// 	}
// }