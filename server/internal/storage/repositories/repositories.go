package repositories

import (
	path_repo "uust-navigator/internal/storage/repositories/path"
	point_repo "uust-navigator/internal/storage/repositories/point"
)

type Repos struct {
	PointRepo *point_repo.PointRepo
	PathRepo  *path_repo.PathRepo
}

func Init() *Repos {
	return &Repos{
		PointRepo: point_repo.Init(),
		PathRepo:  path_repo.Init(),
	}
}
