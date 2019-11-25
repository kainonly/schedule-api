package common

import "time"

type TaskOption struct {
	Identity string                  `json:"identity" validate:"required"`
	TimeZone string                  `json:"time_zone" validate:"required"`
	Start    bool                    `json:"start" validate:"required"`
	Entries  map[string]*EntryOption `json:"entries" validate:"required,dive,required"`
}

type EntryOption struct {
	CronTime string            `json:"cron_time" validate:"required"`
	Url      string            `json:"url" validate:"required,url"`
	Headers  map[string]string `json:"headers"`
	Body     interface{}       `json:"body"`
	NextDate time.Time         `json:"next_date"`
	LastDate time.Time         `json:"last_date"`
}
