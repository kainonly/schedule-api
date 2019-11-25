package router

import "schedule-api/task"

type router struct {
	task task.Task
}

func Init(task *task.Task) *router {
	return &router{
		*task,
	}
}
