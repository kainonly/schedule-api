package common

type TaskOption struct {
	CronTime string `json:"cron_time" validate:"required"`
	Url      uint   `json:"url" validate:"required"`
	Headers  string `json:"username"`
	Body     string `json:"password"`
}
