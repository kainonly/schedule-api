package main

import (
	"github.com/robfig/cron/v3"
	"time"
)

func main() {
	timezone, _ := time.LoadLocation("Asia/Shanghai")
	task := cron.New(
		cron.WithSeconds(),
		cron.WithLocation(timezone),
	)
	entryId1, _ := task.AddFunc("*/2 * * * * *", func() {
		println("every two second")
	})
	entryId2, _ := task.AddFunc("*/4 * * * * *", func() {
		println("every four second")
	})
	println(entryId1)
	println(entryId2)
	task.Start()
	println(task.Entry(entryId1).Next.String())
	time.Sleep(time.Duration(time.Second * 6))
	task.Stop()
}
