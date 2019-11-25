package schedule

type Schedule struct {
}

func InjectSchedule() *Schedule {
	schedule := new(Schedule)
	return schedule
}
