package point_service

import (
	"encoding/base64"
	"fmt"
	"io"
	"os"
	"uust-navigator/internal/domain/models"
	point_repo "uust-navigator/internal/storage/repositories/point"
)

type PointService struct {
	pointRepo *point_repo.PointRepo
}

func Init(pointRepo *point_repo.PointRepo) *PointService {
	return &PointService{
		pointRepo: pointRepo,
	}
}

func (s *PointService) GetPointById(id string) (*models.PointResponse, error) {
	point := s.pointRepo.GetPointById(id)

	f, err := os.Open(fmt.Sprintf("./paths/%s", point.Photo))

	if err != nil {
		return nil, err
	}

	defer f.Close()
	buf, err := io.ReadAll(f)

	if err != nil {
		return nil, err
	}

	photoEncrypted := base64.StdEncoding.EncodeToString(buf)

	return &models.PointResponse{
		PhotoEnc: photoEncrypted,
		Point:    point,
	}, nil
}

func (s *PointService) FindPoints(query string) ([]models.Point, error) {
	points, err := s.pointRepo.FindPoints(query)

	if err != nil {
		return nil, err
	}

	return points, nil
}

func (s *PointService) GetAllPoints() ([]models.Point, error) {
	points, err := s.pointRepo.GetAllPoints()

	if err != nil {
		return nil, err
	}

	return points, nil
}
