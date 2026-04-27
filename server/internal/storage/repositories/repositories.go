package repositories

import (
	"uust-navigator/internal/storage/elastic"
	path_repo "uust-navigator/internal/storage/repositories/path"
	point_repo "uust-navigator/internal/storage/repositories/point"
)

type Repos struct {
	PointRepo *point_repo.PointRepo
	PathRepo  *path_repo.PathRepo
}

func Init(elastic *elastic.ElasticSearch) *Repos {
	return &Repos{
		PointRepo: point_repo.Init(elastic),
		PathRepo:  path_repo.Init(),
	}
}
