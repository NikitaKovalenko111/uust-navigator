package point_repo

import (
	"bytes"
	"context"
	"encoding/json"
	"os"
	"uust-navigator/internal/domain/models"
	"uust-navigator/internal/storage/elastic"
)

type PointRepo struct {
	Data    []models.Point
	Elastic *elastic.ElasticSearch
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
		Data:    payload,
		Elastic: elastic,
	}
}

func (r *PointRepo) IndexData() error {
	jsonData, err := json.Marshal(r.Data)

	if err != nil {
		return err
	}

	res, err := r.Elastic.Client.Index("points", bytes.NewReader(jsonData), r.Elastic.Client.Index.WithDocumentID("1"))
	if err != nil {
		return err
	}
	res.Body.Close()

	r.Elastic.Client.Indices.Refresh(r.Elastic.Client.Indices.Refresh.WithIndex("points"))

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

	res, err := r.Elastic.Client.Search(
		r.Elastic.Client.Search.WithContext(context.Background()),
		r.Elastic.Client.Search.WithIndex("posts"),
		r.Elastic.Client.Search.WithBody(&buf),
		r.Elastic.Client.Search.WithTrackTotalHits(true),
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
