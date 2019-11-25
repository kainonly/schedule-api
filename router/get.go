package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
)

type getBody struct {
	Identity string `json:"identity" validate:"required"`
}

func (r *router) GetRoute(ctx iris.Context) {
	var err error
	var body getBody
	ctx.ReadJSON(&body)
	validate := validator.New()
	err = validate.Struct(body)
	if err != nil {
		ctx.JSON(iris.Map{
			"error": 1,
			"msg":   err.Error(),
		})
		return
	}
	data := r.task.Get(body.Identity)
	ctx.JSON(iris.Map{
		"error": 0,
		"data":  data,
	})
}
