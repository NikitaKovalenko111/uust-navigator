package point_service

import point_repo "uust-navigator/internal/storage/repositories/point"

type PointService struct {
	PointRepo *point_repo.PointRepo
}

func Init(pointRepo *point_repo.PointRepo) *PointService {
	return &PointService{
		PointRepo: pointRepo,
	}
}
