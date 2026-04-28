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

func (c *PointController) RegisterRoutes(router fiber.Router) {
	router.Get("/:id", c.GetPointById)
	router.Get("/", c.FindPoints)
}

func (controller *PointController) GetPointById(c *fiber.Ctx) error {
	id := c.Params("id")

	point := controller.PointService.GetPointById(id)

	return c.JSON(point)
}

func (controller *PointController) FindPoints(c *fiber.Ctx) error {
	query := c.Query("query")

	points, err := controller.PointService.FindPoints(query)

	if err != nil {
		return err
	}

	return c.JSON(points)
}
