package config

import (
	"log"
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	Env           string `yaml:"env" env-default:"local"`
	HTTPServer    `yaml:"http_server"`
	ElasticConfig `yaml:"elastic"`
	//Redis      `yaml:"redis"`
}

/*type Redis struct {
	Address     string        `yaml:"redis_address" env-required:"true"`
	Password    string        `yaml:"redis_password"`
	User        string        `yaml:"redis_user" env-required:"true"`
	Db          int           `yaml:"redis_db" env-default:"0"`
	MaxRetries  int           `yaml:"redis_maxRetries" env-required:"true"`
	DialTimeout time.Duration `yaml:"redis_dialTimeout" env-required:"true"`
	Timeout     time.Duration `yaml:"redis_timeout" env-required:"true"`
}*/

type HTTPServer struct {
	Address     string        `yaml:"http_address" env-default:"localhost:8080"`
	Timeout     time.Duration `yaml:"timeout" env-default:"4s"`
	IdleTimeout time.Duration `yaml:"idle_timeout" env-default:"60s"`
}

type ElasticConfig struct {
	Address  string `yaml:"address" env-default:"localhost:9200"`
	Username string `yaml:"username" env-required:"true"`
	Password string `yaml:"password" env-required:"true"`
}

func MustLoad() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		log.Fatal("CONFIG_PATH is not set")
	}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Fatalf("config file does not exist: %s", configPath)
	}

	var cnf Config
	if err := cleanenv.ReadConfig(configPath, &cnf); err != nil {
		log.Fatalf("cannot read config: %s", err)
	}

	return &cnf
}
