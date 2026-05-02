package point_repo

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"sort"
	domain_errors "uust-navigator/internal/domain/errors"
	"uust-navigator/internal/domain/models"
	"uust-navigator/internal/storage/elastic"
)

type PointRepo struct {
	data    map[string]models.Point
	elastic *elastic.ElasticSearch
}

type Hit struct {
	Index  string       `json:"_index"`
	ID     string       `json:"_id"`
	Score  *float64     `json:"_score,omitempty"`
	Source models.Point `json:"_source"`
}

type HitsWrapper struct {
	Total struct {
		Value int `json:"value"`
	} `json:"total"`
	Hits []Hit `json:"hits"`
}

type SearchResponse struct {
	Took int         `json:"took"`
	Hits HitsWrapper `json:"hits"`
}

func Init(elastic *elastic.ElasticSearch) *PointRepo {
	content, err := os.ReadFile("data2.json")
	if err != nil {
		panic(fmt.Sprintf("%s %s", "Error while reading json: ", err.Error()))
	}

	var payload map[string]models.Point
	err = json.Unmarshal(content, &payload)
	if err != nil {
		panic(fmt.Sprintf("%s %s", "Error during unmarshal: ", err.Error()))
	}

	data := make(map[string]models.Point, len(payload))

	for key, value := range payload {
		data[key] = models.Point{
			Id:          key,
			Description: value.Description,
			Cabinets:    value.Cabinets,
			Tags:        value.Tags,
			Photo:       value.Photo,
		}
	}

	return &PointRepo{
		data:    data,
		elastic: elastic,
	}
}

func (r *PointRepo) IndexData() error {
	for _, item := range r.data {
		b, _ := json.Marshal(item)
		res, err := r.elastic.Client.Index(
			"points",
			bytes.NewReader(b),
			r.elastic.Client.Index.WithDocumentID(item.Id),
		)
		if err != nil {
			return fmt.Errorf("%w: %s", domain_errors.ErrInternalServer, err.Error())
		}
		res.Body.Close()
	}
	_, _ = r.elastic.Client.Indices.Refresh(r.elastic.Client.Indices.Refresh.WithIndex("points"))

	return nil
}

func (r *PointRepo) FindPoints(query string) ([]models.Point, error) {
	queryStr := map[string]interface{}{
		"query": map[string]interface{}{
			"multi_match": map[string]interface{}{
				"query":     query,
				"fields":    []string{"description", "nums", "tags"},
				"type":      "best_fields",
				"fuzziness": "AUTO",
			},
		},
		"size": 10,
	}

	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(queryStr); err != nil {
		return nil, fmt.Errorf("%w: %s", domain_errors.ErrInternalServer, err.Error())
	}

	res, err := r.elastic.Client.Search(
		r.elastic.Client.Search.WithContext(context.Background()),
		r.elastic.Client.Search.WithIndex("points"),
		r.elastic.Client.Search.WithBody(&buf),
		r.elastic.Client.Search.WithTrackTotalHits(true),
	)

	if err != nil {
		return nil, fmt.Errorf("%w: %s", domain_errors.ErrInternalServer, err.Error())
	}

	defer res.Body.Close()

	var sr SearchResponse
	if err := json.NewDecoder(res.Body).Decode(&sr); err != nil {
		return nil, fmt.Errorf("%w: %s", domain_errors.ErrInternalServer, err.Error())
	}

	sources := make([]models.Point, 0, len(sr.Hits.Hits))
	for _, h := range sr.Hits.Hits {
		sources = append(sources, h.Source)
	}

	return sources, nil
}

func (r *PointRepo) GetPointById(id string) *models.Point {
	var point = models.Point{
		Id:          r.data[id].Id,
		Description: r.data[id].Description,
		Cabinets:    r.data[id].Cabinets,
		Tags:        r.data[id].Tags,
		Photo:       r.data[id].Photo,
	}

	return &point
}

func (r *PointRepo) GetAllPoints() []models.Point {
	points := make([]models.Point, 0, len(r.data))

	for _, value := range r.data {
		points = append(points, models.Point{
			Id:          value.Id,
			Description: value.Description,
			Cabinets:    value.Cabinets,
			Tags:        value.Tags,
			Photo:       value.Photo,
		})
	}

	sort.Slice(points, func(i, j int) bool {
		return points[i].Description < points[j].Description
	})

	return points
}
