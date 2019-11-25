package task

import "github.com/robfig/cron/v3"

type Task struct {
	runtime map[string]*cron.Cron
}

func InjectSchedule() *Task {
	task := new(Task)
	task.runtime = make(map[string]*cron.Cron)
	return task
}
