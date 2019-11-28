package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
)

type clearBody struct {
	Identity string `json:"identity" validate:"required"`
}

func (r *router) ClearRoute(ctx iris.Context) {
	var err error
	var body clearBody
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
	query := map[string]interface{}{
		"query": map[string]interface{}{
			"match": map[string]interface{}{
				"identity": body.Identity,
			},
		},
	}
	err = r.elastic.Delete(query)
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
