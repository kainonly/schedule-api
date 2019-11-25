package task

import (
	"github.com/robfig/cron/v3"
	"schedule-api/common"
	"time"
)

func (c *Task) Put(identity string, option common.TaskOption) (err error) {
	timezone, err := time.LoadLocation(option.TimeZone)
	if err != nil {
		return
	}
	c.runtime[identity] = cron.New(cron.WithSeconds(), cron.WithLocation(timezone))
	for key, entry := range option.Entries {
		var entryId cron.EntryID
		entryId, err = c.runtime[identity].AddFunc(entry.CronTime, func() {
			println("abc")
		})
		if err != nil {
			return
		}
		println(key)
		println(entryId)
	}
	if option.Start {
		c.runtime[identity].Start()
	}
	return
}
