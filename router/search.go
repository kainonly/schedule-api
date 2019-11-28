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
	Lte int64 `json:"lte"`
	Gte int64 `json:"gte"`
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
	var must []interface{}
	if body.Type != "" {
		must = append(must, map[string]interface{}{
			"match": map[string]string{
				"type": body.Type,
			},
		})
	}
	if body.Identity != "" {
		must = append(must, map[string]interface{}{
			"match": map[string]string{
				"identity": body.Identity,
			},
		})
	}
	if body.Time != (timeSearchOption{}) {
		timeRange := make(map[string]int64)
		if body.Time.Gte != 0 {
			timeRange["gte"] = body.Time.Gte
		}
		if body.Time.Lte != 0 {
			timeRange["lte"] = body.Time.Lte
		}
		must = append(must, map[string]interface{}{
			"range": map[string]interface{}{
				"time": timeRange,
			},
		})
	}
	query := map[string]interface{}{
		"query": map[string]interface{}{
			"bool": map[string]interface{}{
				"must": must,
			},
		},
		"size": body.Limit,
		"from": body.Skip,
		"sort": map[string]interface{}{
			"time": map[string]string{
				"order": "desc",
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
