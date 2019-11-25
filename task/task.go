package task

import (
	"github.com/robfig/cron/v3"
	"schedule-api/common"
)

type Task struct {
	runtime map[string]*cron.Cron
	options map[string]map[string]common.EntryOption
	entries map[string]map[string]cron.EntryID
}

func InjectSchedule() *Task {
	task := new(Task)
	task.runtime = make(map[string]*cron.Cron)
	task.options = make(map[string]map[string]common.EntryOption)
	task.entries = make(map[string]map[string]cron.EntryID)
	return task
}
