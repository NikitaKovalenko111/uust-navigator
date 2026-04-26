package storage

import (
	"uust-navigator/internal/storage/repositories"

	_ "github.com/lib/pq"
)

type Storage struct {
	Repositories *repositories.Repos
}

func Init() *Storage {
	storage := Storage{
		Repositories: repositories.Init(),
	}

	return &storage
}
