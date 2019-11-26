package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
	"schedule-api/common"
)

type listsBody struct {
	Identity []string `json:"identity" validate:"required"`
}

func (r *router) ListsRoute(ctx iris.Context) {
	var err error
	var body listsBody
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
	var lists []common.TaskOption
	for _, identity := range body.Identity {
		data := r.task.Get(identity)
		if data != nil {
			lists = append(lists, *data)
		}
	}
	ctx.JSON(iris.Map{
		"error": 0,
		"data":  lists,
	})
}
