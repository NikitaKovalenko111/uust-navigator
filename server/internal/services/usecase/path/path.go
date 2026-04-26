package path_service

import path_repo "uust-navigator/internal/storage/repositories/path"

type PathService struct {
	PathRepo *path_repo.PathRepo
}

func Init(repo *path_repo.PathRepo) *PathService {
	return &PathService{
		PathRepo: repo,
	}
}
