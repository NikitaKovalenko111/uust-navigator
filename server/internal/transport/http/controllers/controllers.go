package controllers

import (
	"log/slog"
	"uust-navigator/internal/services"
	path_controller "uust-navigator/internal/transport/http/controllers/path"
	point_controller "uust-navigator/internal/transport/http/controllers/point"

	"github.com/gofiber/fiber/v2"
)

type Controllers struct {
	logger          *slog.Logger
	PointController *point_controller.PointController
	PathController  *path_controller.PathController
}

func Init(services *services.Services, logger *slog.Logger) *Controllers {
	return &Controllers{
		logger:          logger,
		PointController: point_controller.Init(services.PointService),
		PathController:  path_controller.Init(services.PathService),
	}
}

func (c *Controllers) RegisterRoutes(app *fiber.App) {
	c.PathController.RegisterRoutes()
	c.PointController.RegisterRoutes(app.Group("/points"))
}
