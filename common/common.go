package common

type TaskOption struct {
	CronTime string            `json:"cron_time" validate:"required"`
	Url      string            `json:"url" validate:"required,url"`
	Headers  map[string]string `json:"headers"`
	Body     interface{}       `json:"body"`
}
