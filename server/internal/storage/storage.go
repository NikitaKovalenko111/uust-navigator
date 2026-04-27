package storage

import (
	"uust-navigator/internal/storage/elastic"
	"uust-navigator/internal/storage/repositories"

	_ "github.com/lib/pq"
)

type Storage struct {
	Repositories *repositories.Repos
}

func Init(elastic *elastic.ElasticSearch) *Storage {
	storage := Storage{
		Repositories: repositories.Init(elastic),
	}

	return &storage
}
