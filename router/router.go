package router

import "schedule-api/schedule"

type router struct {
	schedule schedule.Schedule
}

func Init(schedule *schedule.Schedule) *router {
	return &router{
		*schedule,
	}
}
