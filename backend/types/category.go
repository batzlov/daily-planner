package types

type CreateCategoryBody struct {
	Title 			string  `form:"title" binding:"required,min=2,max=64"`
	CreatedBy 		uint 	`form:"createdBy"`
}

type UpdateCategoryParams struct {
	CategoryId uint `uri:"categoryId" binding:"required"`
}

type UpdateCategoryBody struct {
	CreateCategoryBody
}

type DeleteCategoryParams struct {
	CategoryId uint `uri:"categoryId" binding:"required"`
}