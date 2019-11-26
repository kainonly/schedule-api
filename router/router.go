package router

import (
	"schedule-api/elastic"
	"schedule-api/task"
)

type router struct {
	task    *task.Task
	elastic *elastic.Elastic
}

func Init(task *task.Task, elastic *elastic.Elastic) *router {
	return &router{
		task,
		elastic,
	}
}
