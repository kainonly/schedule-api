package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
	"schedule-api/common"
)

type putBody struct {
	Identity string              `json:"identity" validate:"required"`
	TimeZone string              `json:"time_zone" validate:"required"`
	Start    bool                `json:"start" validate:"required"`
	Tasks    []common.TaskOption `json:"tasks" validate:"required,dive,required"`
}

func (r *router) PutRoute(ctx iris.Context) {
	var body putBody
	ctx.ReadJSON(&body)
	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		ctx.JSON(iris.Map{
			"error": 1,
			"msg":   err.Error(),
		})
		return
	}
	ctx.JSON(iris.Map{
		"error": 0,
		"msg":   "ok",
	})
}
