package services

import (
	"uust-navigator/internal/config"
	path_service "uust-navigator/internal/services/usecase/path"
	point_service "uust-navigator/internal/services/usecase/point"
	"uust-navigator/internal/storage/repositories"
	//"github.com/redis/go-redis/v9"
)

type Services struct {
	PointService *point_service.PointService
	PathService  *path_service.PathService
}

func Init(repos *repositories.Repos, cfg *config.Config) *Services {
	return &Services{
		PointService: point_service.Init(repos.PointRepo),
		PathService:  path_service.Init(repos.PathRepo, repos.PointRepo),
	}
}
