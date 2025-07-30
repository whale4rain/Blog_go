package initialize

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"server/global"
	"server/router"
)

func InitRouter() *gin.Engine {
	gin.SetMode(global.Config.System.Env)
	Router := gin.Default()

	var store = cookie.NewStore([]byte(global.Config.System.SessionsSecret))
	Router.Use(sessions.Sessions("session", store))

	routerGroup := router.RouterGroupApp

	publicGroup := Router.Group(global.Config.System.RouterPrefix)
	{
		routerGroup.InitBaseRouter(publicGroup)
	}
	return Router
}
