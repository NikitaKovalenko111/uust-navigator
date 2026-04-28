package point_repo

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"
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

	return &PointRepo{
		data:    payload,
		elastic: elastic,
	}
}

func (r *PointRepo) IndexData() error {
	jsonData, err := json.Marshal(r.data)

	if err != nil {
		return err
	}

	res, err := r.elastic.Client.Index("points", bytes.NewReader(jsonData), r.elastic.Client.Index.WithDocumentID("1"))
	if err != nil {
		return err
	}
	res.Body.Close()

	r.elastic.Client.Indices.Refresh(r.elastic.Client.Indices.Refresh.WithIndex("points"))

	return nil
}

func (r *PointRepo) FindPoints(query string) ([]models.Point, error) {
	queryStr := map[string]interface{}{
		"query": map[string]interface{}{
			"multi_match": map[string]interface{}{
				"query":  query,
				"fields": []string{"description", "nums", "tags"},
				"type":   "best_fields",
			},
		},
		"size": 10,
	}

	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(queryStr); err != nil {
		return nil, err
	}

	res, err := r.elastic.Client.Search(
		r.elastic.Client.Search.WithContext(context.Background()),
		r.elastic.Client.Search.WithIndex("posts"),
		r.elastic.Client.Search.WithBody(&buf),
		r.elastic.Client.Search.WithTrackTotalHits(true),
	)

	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	var sr SearchResponse
	if err := json.NewDecoder(res.Body).Decode(&sr); err != nil {
		return nil, err
	}

	sources := make([]models.Point, 0, len(sr.Hits.Hits))
	for _, h := range sr.Hits.Hits {
		sources = append(sources, h.Source)
	}

	return sources, nil
}

func (r *PointRepo) GetPointById(id string) *models.Point {
	var point = models.Point{
		Description: r.data[id].Description,
		Cabinets:    r.data[id].Cabinets,
		Tags:        r.data[id].Tags,
		Photo:       r.data[id].Photo,
	}

	return &point
}
