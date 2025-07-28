package initialize

import (
	"server/global"

	"os"

	"github.com/elastic/elastic-transport-go/v8/elastictransport"
	"github.com/elastic/go-elasticsearch/v8"
	"go.uber.org/zap"
)

func ConnectEs() *elasticsearch.TypedClient {
	esCfg := global.Config.ES

	cfg := elasticsearch.Config{
		Addresses: []string{esCfg.URL},
		Username:  esCfg.Username,
		Password:  esCfg.Password,
	}

	if esCfg.IsConsolePrint {
		cfg.Logger = &elastictransport.ColorLogger{
			Output:            os.Stdout,
			EnableRequestBody: true,
		}
	}

	client, err := elasticsearch.NewTypedClient(cfg)
	if err != nil {
		global.Log.Error("Failed to connect to Elasticsearch:", zap.Error(err))
		os.Exit(1)
	}

	return client

}
