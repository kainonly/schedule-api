package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
	"schedule-api/common"
	"time"
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
	err = r.task.Delete(body.Identity)
	if err != nil {
		ctx.JSON(iris.Map{
			"error": 1,
			"msg":   err.Error(),
		})
		return
	}
	err = r.elastic.Index(common.Logs{
		Type:     "delete",
		Identity: body.Identity,
		Body:     body,
		Time:     time.Now().Unix(),
	})
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
