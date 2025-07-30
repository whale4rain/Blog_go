package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
)

type BaseRouter struct {
}

func (b *BaseRouter) InitBaseRouter(Router *gin.RouterGroup) {
	baseRouter := Router.Group("base")
	baseApi := api.ApiGroupApp.BaseApi
	{
		baseRouter.POST("captcha", baseApi.Captcha)
		baseRouter.POST("sendEmailVertificationCode", baseApi.SendEmailVertificationCode)
		baseRouter.GET("qqLoginURL", baseApi.QQLoginURL)
	}
}
