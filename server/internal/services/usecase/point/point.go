package point_service

import (
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

func (s *PointService) GetPointById(id string) *models.Point {
	point := s.pointRepo.GetPointById(id)

	return point
}

func (s *PointService) FindPoints(query string) ([]models.Point, error) {
	points, err := s.pointRepo.FindPoints(query)

	if err != nil {
		return nil, err
	}

	return points, nil
}
