package task

import (
	"github.com/robfig/cron/v3"
	"schedule-api/common"
	"schedule-api/elastic"
)

type Task struct {
	runtime map[string]*cron.Cron
	options map[string]*common.TaskOption
	entries map[string]map[string]cron.EntryID
	elastic *elastic.Elastic
}

func Inject(elastic *elastic.Elastic) *Task {
	task := new(Task)
	task.runtime = make(map[string]*cron.Cron)
	task.options = make(map[string]*common.TaskOption)
	task.entries = make(map[string]map[string]cron.EntryID)
	task.elastic = elastic
	return task
}

func (c *Task) GetTaskOptions() map[string]*common.TaskOption {
	return c.options
}

func (c *Task) close(identity string) {
	if c.runtime[identity] == nil {
		return
	}
	if c.options[identity] != nil {
		for _, entry := range c.runtime[identity].Entries() {
			c.runtime[identity].Remove(entry.ID)
		}
	}
	c.runtime[identity].Stop()
}
