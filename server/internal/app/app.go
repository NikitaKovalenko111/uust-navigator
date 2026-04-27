package app

import (
	"uust-navigator/internal/config"
	"uust-navigator/internal/logger/sl"
	"uust-navigator/internal/middleware"
	"uust-navigator/internal/services"
	"uust-navigator/internal/storage"

	//redisStorage "uust-navigator/internal/storage/redis"
	"uust-navigator/internal/storage/elastic"
	"uust-navigator/internal/transport/http"

	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/gofiber/fiber/v2"
)

type App struct {
	http   *http.HTTP
	app    *fiber.App
	config *config.Config
}

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
func New(cfg *config.Config) *App {
	logger := sl.InitLogger(cfg.Env)

	logger.Info("Logger is enabled")
	logger.Debug("Debug is enabled")

	logger.Info("Successfully inited storage!")

	//redisClient, err := redisStorage.NewClient(context.Background(), cfg)

	/*if err != nil {
		panic("Couldn't connect to redis!")
	}*/

	elastic := elastic.Init(cfg)

	storage := storage.Init(elastic)

	logger.Info("Successfully inited repositories!")

	services := services.Init(storage.Repositories, cfg)

	logger.Info("Successfully inited services!")

	app := fiber.New(fiber.Config{
		StrictRouting: true,
		WriteTimeout:  cfg.HTTPServer.Timeout,
		IdleTimeout:   cfg.HTTPServer.IdleTimeout,
	})

	swaggerCfg := swagger.Config{
		BasePath: "/api",
		FilePath: "./docs/swagger.json",
		Path:     "docs",
		Title:    "Swagger API Docs",
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowCredentials: true,
	}))
	app.Use(swagger.New(swaggerCfg))
	app.Use(middleware.NewLogger(logger))

	http := http.Init(services, logger, app)

	return &App{
		http:   http,
		config: cfg,
		app:    app,
	}
}

func (app *App) Run() {
	app.http.Start()

	go app.app.Listen(app.config.HTTPServer.Address)
}

func (app *App) Stop() {
	app.app.Shutdown()
}
