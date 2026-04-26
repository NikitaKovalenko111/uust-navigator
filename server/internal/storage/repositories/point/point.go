package point_repo

import (
	"encoding/json"
	"os"
	"uust-navigator/internal/domain/models"
)

type PointRepo struct {
	Data []models.Point
}

func Init() *PointRepo {
	content, err := os.ReadFile("./../../../data2.json")
	if err != nil {
		panic("Error while reading json...")
	}

	var payload []models.Point
	err = json.Unmarshal(content, &payload)
	if err != nil {
		panic("Error during unmarshal...")
	}

	return &PointRepo{
		Data: payload,
	}
}
