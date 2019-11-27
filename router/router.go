package router

import (
	"schedule-api/elastic"
	"schedule-api/task"
)

type router struct {
	elastic *elastic.Elastic
	task    *task.Task
}

func Init(elastic *elastic.Elastic, task *task.Task) *router {
	return &router{
		elastic,
		task,
	}
}
