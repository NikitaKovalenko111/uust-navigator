package point_controller

import (
	"errors"
	"log/slog"
	domain_errors "uust-navigator/internal/domain/errors"
	point_service "uust-navigator/internal/services/usecase/point"
	http_errors "uust-navigator/internal/transport/http/errors"

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

// GetAllPoints godoc
//
//	@Summary		Get all points
//	@Description	Gets all points from data and returns to user
//	@Tags			points
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	models.PointResponse
//	@Failure		500 {object}	http_errors.HTTPError
//	@Router			/points/{id} [get]
func (controller *PointController) GetAllPoints(c *fiber.Ctx) error {
	points := controller.PointService.GetAllPoints()

	return c.Status(fiber.StatusOK).JSON(points)
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
//	@Failure		500 {object}	http_errors.HTTPError
//	@Router			/points/{id} [get]
func (controller *PointController) GetPointById(c *fiber.Ctx) error {
	id := c.Params("id")

	point, err := controller.PointService.GetPointById(id)

	if err != nil {
		controller.logger.Error(err.Error())

		if errors.Is(err, domain_errors.ErrInternalServer) {
			return c.Status(fiber.ErrInternalServerError.Code).JSON(http_errors.HTTPError{
				Message: domain_errors.ErrInternalServer.Error(),
				Code:    fiber.ErrInternalServerError.Code,
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(point)
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
//	@Failure		500 {object}	http_errors.HTTPError
//	@Router			/points/ [get]
func (controller *PointController) FindPoints(c *fiber.Ctx) error {
	query := c.Query("query")

	points, err := controller.PointService.FindPoints(query)

	if err != nil {
		controller.logger.Error(err.Error())

		if errors.Is(err, domain_errors.ErrInternalServer) {
			return c.Status(fiber.ErrInternalServerError.Code).JSON(http_errors.HTTPError{
				Message: domain_errors.ErrInternalServer.Error(),
				Code:    fiber.ErrInternalServerError.Code,
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(points)
}
