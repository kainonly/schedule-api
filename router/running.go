package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
)

type runningBody struct {
	Identity string `json:"identity" validate:"required"`
	Running  *bool  `json:"running" validate:"required"`
}

func (r *router) RunningRoute(ctx iris.Context) {
	var err error
	var body runningBody
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
	err = r.task.Running(body.Identity, *body.Running)
	if err != nil {
		ctx.JSON(iris.Map{
			"error": 1,
			"msg":   err.Error(),
		})
	} else {
		ctx.JSON(iris.Map{
			"error": 0,
			"msg":   "ok",
		})
	}
}
