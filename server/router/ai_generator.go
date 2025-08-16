package router

import (
	"server/api"

	"github.com/gin-gonic/gin"
)

type AIRouter struct {
}

func (a *AIRouter) InitAIRouter(Router *gin.RouterGroup) {
	aiRouter := Router.Group("ai")

	aiApi := api.ApiGroupApp.AIApi.NewAIApi()
	{
		aiRouter.POST("generate-meta", aiApi.AiGenerateMeta)
	}
}
