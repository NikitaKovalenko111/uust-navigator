package path_repo

import (
	"encoding/json"
	"os"
	"uust-navigator/internal/domain/models"
)

type PathRepo struct {
	data map[string]map[string]models.Path
}

func Init() *PathRepo {
	content, err := os.ReadFile("data.json")
	if err != nil {
		panic("Error while reading json...")
	}

	var payload map[string]map[string]models.Path
	err = json.Unmarshal(content, &payload)
	if err != nil {
		panic("Error during unmarshal...")
	}

	return &PathRepo{
		data: payload,
	}
}

func (r *PathRepo) FindPath(startPoint string, endPoint string) *models.Path {
	found := r.data[startPoint][endPoint]

	var path = models.Path{
		Depth:      found.Depth,
		PathString: found.PathString,
	}

	return &path
}
