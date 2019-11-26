package main

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/logger"
	"github.com/kataras/iris/v12/middleware/recover"
	"net/http"
	_ "net/http/pprof"
	"schedule-api/router"
	"schedule-api/task"
)

func main() {
	go func() {
		http.ListenAndServe(":6060", nil)
	}()
	app := iris.New()
	app.Logger().SetLevel("debug")
	app.Use(recover.New())
	app.Use(logger.New())
	routes := router.Init(
		task.InjectSchedule(),
	)
	app.Post("put", routes.PutRoute)
	app.Post("get", routes.GetRoute)
	app.Post("lists", routes.ListsRoute)
	app.Post("all", routes.AllRoute)
	app.Run(iris.Addr(":3000"), iris.WithoutServerError(iris.ErrServerClosed))
}
