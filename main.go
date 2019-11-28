package main

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/logger"
	"github.com/kataras/iris/v12/middleware/recover"
	"gopkg.in/ini.v1"
	"log"
	"schedule-api/common"
	"schedule-api/elastic"
	"schedule-api/router"
	"schedule-api/task"
)

func main() {
	cfg, err := ini.Load("config.ini")
	if err != nil {
		log.Fatalln(err)
	}
	app := iris.New()
	app.Logger().SetLevel("error")
	app.Use(recover.New())
	app.Use(logger.New())
	common.InitLevelDB("data")
	common.Record = make(chan interface{})
	routes := router.Init(
		elastic.Inject(cfg.Section("elasticsearch")),
		task.Inject(),
	)
	app.Post("put", routes.PutRoute)
	app.Post("get", routes.GetRoute)
	app.Post("lists", routes.ListsRoute)
	app.Post("all", routes.AllRoute)
	app.Post("running", routes.RunningRoute)
	app.Post("delete", routes.DeleteRoute)
	app.Post("search", routes.SearchRoute)
	app.Post("clear", routes.ClearRoute)
	app.Run(
		iris.Addr(":3000"),
		iris.WithoutServerError(iris.ErrServerClosed),
	)
}
