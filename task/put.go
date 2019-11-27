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
	c.close(identity)
	c.options[identity] = &option
	c.runtime[identity] = cron.New(cron.WithSeconds(), cron.WithLocation(timezone))
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
	option := c.options[identity].Entries[key]
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
			var message []string
			for _, value := range errs {
				message = append(message, value.Error())
			}
			//if (*c.ctx).Value("elastic") != nil {
			//	es := (*c.ctx).Value("elastic").(*elastic.Elastic)
			//	err := es.Index(common.RecordError{
			//		Type:     "error",
			//		Identity: identity,
			//		Key:      key,
			//		Url:      option.Url,
			//		Header:   option.Headers,
			//		Body:     option.Body,
			//		Message:  message,
			//		Time:     time.Now(),
			//	});
			//	if err != nil {
			//		println(err.Error())
			//	}
			//	(*c.ctx).Done()
			//}
		} else {
			//if (*c.ctx).Value("elastic") != nil {
			//	es := (*c.ctx).Value("elastic").(*elastic.Elastic)
			//	err := es.Index(common.RecordSuccess{
			//		Type:     "success",
			//		Identity: identity,
			//		Key:      key,
			//		Url:      option.Url,
			//		Header:   option.Headers,
			//		Body:     option.Body,
			//		Response: body,
			//		Time:     time.Now(),
			//	});
			//	if err != nil {
			//		println(err.Error())
			//	}
			//}
			println(body)
		}
	})
	if err != nil {
		return
	}
}
