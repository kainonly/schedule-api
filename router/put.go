package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
	"schedule-api/common"
	"time"
)

func (r *router) PutRoute(ctx iris.Context) {
	var err error
	var body common.TaskOption
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
	err = r.task.Put(body)
	if err != nil {
		ctx.JSON(iris.Map{
			"error": 1,
			"msg":   err.Error(),
		})
		return
	}
	err = r.elastic.Index(common.Logs{
		Type:     "put",
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
