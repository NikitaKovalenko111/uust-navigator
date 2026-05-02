package point_controller

import (
	"log/slog"
	point_service "uust-navigator/internal/services/usecase/point"

	"github.com/gofiber/fiber/v2"
)

type PointController struct {
	PointService *point_service.PointService
	logger       *slog.Logger
}

func Init(pointService *point_service.PointService) *PointController {
	return &PointController{
		PointService: pointService,
	}
}

func (c *PointController) RegisterRoutes(router fiber.Router) {
	router.Get("/all", c.GetAllPoints)
	router.Get("/:id", c.GetPointById)
	router.Get("/", c.FindPoints)
}

func (controller *PointController) GetAllPoints(c *fiber.Ctx) error {
	points, err := controller.PointService.GetAllPoints()

	if err != nil {
		return err
	}

	return c.JSON(points)
}

// GetPointById godoc
//
//	@Summary		Get point by id
//	@Description	Gets point by id from data and returns to user
//	@Tags			points
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int	string	"Point ID"
//	@Success		200	{object}	models.PointResponse
//	@Router			/points/{id} [get]
func (controller *PointController) GetPointById(c *fiber.Ctx) error {
	id := c.Params("id")

	point, err := controller.PointService.GetPointById(id)

	if err != nil {
		return err
	}

	return c.JSON(point)
}

// FindPoints godoc
//
//	@Summary		Find points by query
//	@Description	Finds points by query matches in tags, description and cabinets nearby
//	@Tags			points
//	@Accept			json
//	@Produce		json
//	@Param			query	query		string	true	"query for searching points"
//	@Success		200		{object}	models.Point
//	@Router			/points/ [get]
func (controller *PointController) FindPoints(c *fiber.Ctx) error {
	query := c.Query("query")

	points, err := controller.PointService.FindPoints(query)

	if err != nil {
		return err
	}

	return c.JSON(points)
}
