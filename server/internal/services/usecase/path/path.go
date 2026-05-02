package path_service

import (
	"strings"
	"uust-navigator/internal/domain/models"
	path_repo "uust-navigator/internal/storage/repositories/path"
	point_repo "uust-navigator/internal/storage/repositories/point"
)

type PathService struct {
	PathRepo  *path_repo.PathRepo
	PointRepo *point_repo.PointRepo
}

func Init(pathRepo *path_repo.PathRepo, pointRepo *point_repo.PointRepo) *PathService {
	return &PathService{
		PathRepo:  pathRepo,
		PointRepo: pointRepo,
	}
}

func (s *PathService) FindPath(startPoint string, endPoint string) *models.PathResponse {
	path := s.PathRepo.FindPath(startPoint, endPoint)

	pathArray := make([]models.Point, 0)

	for _, id := range strings.Split(path.PathString, "/") {
		point := s.PointRepo.GetPointById(id)

		pathArray = append(pathArray, *point)
	}

	return &models.PathResponse{
		Depth:     path.Depth,
		PathArray: pathArray,
	}
}
