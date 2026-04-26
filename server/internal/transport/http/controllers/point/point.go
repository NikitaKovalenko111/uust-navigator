package point_controller

import (
	point_service "uust-navigator/internal/services/usecase/point"

	"github.com/gofiber/fiber/v2"
)

type PointController struct {
	PointService *point_service.PointService
}

func Init(pointService *point_service.PointService) *PointController {
	return &PointController{
		PointService: pointService,
	}
}

func (c *PointController) RegisterRoutes(router *fiber.App) {

}
