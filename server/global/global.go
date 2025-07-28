package global

import (
	"server/config"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/go-redis/redis"
	"github.com/songzhibin97/gkit/cache/local_cache"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	Config     *config.Config
	Log        *zap.Logger
	ES         *config.ES
	ESClient   *elasticsearch.TypedClient
	DB         *gorm.DB
	Redis      redis.Client
	BlackCache local_cache.Cache
)
