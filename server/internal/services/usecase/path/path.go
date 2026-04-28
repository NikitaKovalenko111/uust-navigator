package path_service

import (
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

func (s *PathService) FindPath(startPoint string, endPoint string) *models.Path {
	path := s.PathRepo.FindPath(startPoint, endPoint)

	return path
}
