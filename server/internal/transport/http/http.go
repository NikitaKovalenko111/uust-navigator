package http

import (
	"log/slog"
	"uust-navigator/internal/services"
	"uust-navigator/internal/transport/http/controllers"

	"github.com/gofiber/fiber/v2"
)

type HTTP struct {
	app         *fiber.App
	controllers *controllers.Controllers
}

func Init(services *services.Services, logger *slog.Logger, app *fiber.App) *HTTP {
	return &HTTP{
		app:         app,
		controllers: controllers.Init(services, logger),
	}
}

func (http *HTTP) Start() {
	http.controllers.RegisterRoutes(http.app)
}
