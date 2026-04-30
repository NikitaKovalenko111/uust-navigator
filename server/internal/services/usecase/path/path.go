package path_service

import (
	"strings"
	"uust-navigator/internal/domain/models"
	path_repo "uust-navigator/internal/storage/repositories/path"
)

type PathService struct {
	PathRepo *path_repo.PathRepo
}

func Init(repo *path_repo.PathRepo) *PathService {
	return &PathService{
		PathRepo: repo,
	}
}

func (s *PathService) FindPath(startPoint string, endPoint string) *models.PathResponse {
	path := s.PathRepo.FindPath(startPoint, endPoint)

	return &models.PathResponse{
		Depth:     path.Depth,
		PathArray: strings.Split(path.PathString, "/"),
	}
}
