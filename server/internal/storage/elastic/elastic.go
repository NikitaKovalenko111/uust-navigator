package elastic

import (
	"uust-navigator/internal/config"

	"github.com/elastic/go-elasticsearch/v9"
)

type ElasticSearch struct {
	Client *elasticsearch.Client
	Config *config.Config
}

func Init(cfg *config.Config) *ElasticSearch {
	es, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: []string{cfg.ElasticConfig.Address},
		Username:  cfg.ElasticConfig.Username,
		Password:  cfg.ElasticConfig.Password,
	})

	if err != nil {
		panic("Couldn't create elastic search client...")
	}

	return &ElasticSearch{
		Client: es,
	}
}
