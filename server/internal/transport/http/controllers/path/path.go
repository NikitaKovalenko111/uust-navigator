package path_controller

import path_service "uust-navigator/internal/services/usecase/path"

type PathController struct {
	PathService *path_service.PathService
}

func Init(pathService *path_service.PathService) *PathController {
	return &PathController{
		PathService: pathService,
	}
}

func (c *PathController) RegisterRoutes() {

}
