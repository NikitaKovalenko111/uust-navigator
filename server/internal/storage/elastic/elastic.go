package elastic

import (
	"log/slog"
	"time"
	"uust-navigator/internal/config"

	"net/http"

	"github.com/elastic/go-elasticsearch/v9"
)

type ElasticSearch struct {
	Client *elasticsearch.Client
	Config *config.Config
}

func Init(cfg *config.Config, logger *slog.Logger) *ElasticSearch {
	es, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: []string{cfg.ElasticConfig.Address},
	})

	if err != nil {
		panic("Couldn't create elastic search client...")
	}

	for true {
		resp, err := http.Get(cfg.ElasticConfig.Address + "/_cluster/health?wait_for_status=yellow&timeout=1s")

		if err == nil && resp != nil {
			resp.Body.Close()

			if resp.StatusCode >= 200 && resp.StatusCode < 300 {
				break
			}
		}

		logger.Error("Elastic search is not started yet!")

		time.Sleep(2 * time.Second)
	}

	return &ElasticSearch{
		Client: es,
	}
}
