package main

import (
	"os"
	"os/signal"
	"syscall"
	"uust-navigator/internal/app"
	"uust-navigator/internal/config"

	_ "uust-navigator/docs"
)

//	@title			UUST Navigator
//	@version		1.0
//	@description	API Docs of UUST Navigator

// BasePath /
func main() {
	cfg := config.MustLoad()

	app := app.New(cfg)

	go app.Run()

	exit := make(chan os.Signal, 1)
	signal.Notify(exit, os.Interrupt, syscall.SIGTERM)

	<-exit

	app.Stop()
}
