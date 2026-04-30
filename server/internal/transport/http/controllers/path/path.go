package path_controller

import (
	path_service "uust-navigator/internal/services/usecase/path"

	"github.com/gofiber/fiber/v2"
)

type PathController struct {
	PathService *path_service.PathService
}

func Init(pathService *path_service.PathService) *PathController {
	return &PathController{
		PathService: pathService,
	}
}

func (c *PathController) RegisterRoutes(router fiber.Router) {
	router.Get("/navigate", c.FindPath)
}

// FindPath godoc
//
//	@Summary		Find path
//	@Description	Finds path by start point and end point
//	@Tags			path
//	@Accept			json
//	@Produce		json
//	@Param			start	query		string	true	"id of start point of path"
//	@Param			end		query		string	true	"id of end point of path"
//	@Success		200		{object}	models.PathResponse
//	@Router			/path [get]
func (controller *PathController) FindPath(c *fiber.Ctx) error {
	startPoint := c.Query("start")
	endPoint := c.Query("end")

	path := controller.PathService.FindPath(startPoint, endPoint)

	return c.JSON(path)
}
