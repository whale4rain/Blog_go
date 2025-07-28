package service

import (
	"context"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"server/global"
)

type EsService struct{}

func (esService *EsService) IndexCreate(indexName string, mapping *tyeps.TypeMapping) error {
	_, err := global.ESClient.Indices.Create(indexName).Mapping(mapping).Do(context.TODO())
	return err
}

func (esService *EsService) IndexDelete(indexName string) error {
	_, err := global.ESClient.Indices.Delete(indexName).Do(context.TODO())
	return err
}

func (esService *EsService) IndexExists(indexName string) bool {
	_, err := global.ESClient.Indices.Exists(indexName).Do(context.TODO())
	return err == nil
}
