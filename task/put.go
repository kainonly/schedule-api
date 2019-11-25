package task

import (
	"github.com/parnurzeal/gorequest"
	"github.com/robfig/cron/v3"
	"schedule-api/common"
	"time"
)

func (c *Task) Put(option common.TaskOption) (err error) {
	identity := option.Identity
	timezone, err := time.LoadLocation(option.TimeZone)
	if err != nil {
		return
	}
	c.runtime[identity] = cron.New(cron.WithSeconds(), cron.WithLocation(timezone))
	c.options[identity] = option.Entries
	c.entries[identity] = make(map[string]cron.EntryID)
	for key := range option.Entries {
		go c.webhook(identity, key)
	}
	if option.Start {
		c.runtime[identity].Start()
	}
	return
}

func (c *Task) webhook(identity string, key string) {
	var err error
	option := c.options[identity][key]
	c.entries[identity][key], err = c.runtime[identity].AddFunc(option.CronTime, func() {
		agent := gorequest.New().Post(option.Url)
		if option.Headers != nil {
			for key, value := range option.Headers {
				agent.Set(key, value)
			}
		}
		if option.Body != nil {
			agent.Send(option.Body)
		}
		_, body, errs := agent.End()
		if errs != nil {
			return
		}
		println(body)
	})
	if err != nil {
		return
	}
}
