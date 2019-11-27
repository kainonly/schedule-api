package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
)

type searchBody struct {
	Type     string           `json:"type" validate:"omitempty,oneof=put delete running success error"`
	Identity string           `json:"identity" validate:"required"`
	Time     timeSearchOption `json:"time" validate:"omitempty"`
	Limit    *int             `json:"limit" validate:"required,max=100,min=1"`
	Skip     *int             `json:"skip" validate:"required"`
}

type timeSearchOption struct {
	Lt  int64 `json:"lt"`
	Gt  int64 `json:"gt"`
	Lte int64 `json:"lte"`
	Gte int64 `json:"gte"`
	Eq  int64 `json:"eq"`
	Ne  int64 `json:"ne"`
}

func (r *router) SearchRoute(ctx iris.Context) {
	var err error
	var body searchBody
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
				"type": body.Type,
			},
		},
	}
	raws, err := r.elastic.Search(query)
	if err != nil {
		ctx.JSON(iris.Map{
			"error": 1,
			"msg":   err.Error(),
		})
	} else {
		ctx.JSON(iris.Map{
			"error": 0,
			"data":  raws,
		})
	}
}
