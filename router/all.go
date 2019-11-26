package router

import (
	"github.com/kataras/iris/v12"
)

func (r *router) AllRoute(ctx iris.Context) {
	var keys []string
	for key := range r.task.GetTaskOptions() {
		keys = append(keys, key)
	}
	ctx.JSON(iris.Map{
		"error": 0,
		"data":  keys,
	})
}
