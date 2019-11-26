package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
)

type deleteBody struct {
	Identity string `json:"identity" validate:"required"`
}

func (r *router) DeleteRoute(ctx iris.Context) {
	var err error
	var body deleteBody
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
	r.task.Delete(body.Identity)
	ctx.JSON(iris.Map{
		"error": 0,
		"msg":   "ok",
	})
}
