package types

type SignUpBody struct {
	FirstName 	string `form:"firstName" binding:"required,min=2,max=64"`
	LastName 	string `form:"lastName" binding:"required,min=2,max=64"`
	Email 		string `form:"email" binding:"required,email"`
	Password 	string `form:"password" binding:"required,min=8,max=64"`
}

type SignInBody struct {
	Email 		string `form:"email" binding:"required,email"`
	Password 	string `form:"password" binding:"required,min=8,max=64"`
}