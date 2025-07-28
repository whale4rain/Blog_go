package initialize

import (
	"server/global"

	"github.com/go-redis/redis"
	"go.uber.org/zap"
	"os"
)

func ConnectRedis() redis.Client {
	redisCfg := global.Config.Redis

	client := redis.NewClient(&redis.Options{
		Addr:     redisCfg.Address,
		Password: redisCfg.Password,
		DB:       redisCfg.DB,
	})

	_, err := client.Ping().Result()

	if err != nil {
		global.Log.Error("Failed to connect to Redis:", zap.Error(err))
		os.Exit(1)
	}

	return *client

}
