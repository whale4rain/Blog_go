package api

import (
	"errors"
	"server/global"
	"server/model/database"
	"server/model/request"
	"server/model/response"
	"server/utils"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"go.uber.org/zap"
)

type UserApi struct {
}

func (userApi *UserApi) Register(c *gin.Context) {
	var req request.Register
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	session := sessions.Default(c)
	savedEmail := session.Get("email")
	if savedEmail == nil || savedEmail.(string) != req.Email {
		response.FailWithMessage("This email donesn't match the email to be verified", c)
		return
	}
	savedCode := session.Get("code")
	if savedCode == nil || savedCode.(string) != req.VerificationCode {
		response.FailWithMessage("Invalid verification code", c)
		return
	}
	savedTime := session.Get("expire_time")
	if savedTime.(int64) < time.Now().Unix() {
		response.FailWithMessage("The verification code has expired, please resent it", c)
		return
	}
	u := database.User{
		Username: req.Username,
		Password: req.Password,
		Email:    req.Email,
	}
	user, err := userService.Register(u)
	if err != nil {
		global.Log.Error("Fail to register user:", zap.Error(err))
		response.FailWithMessage("Failed to register user", c)
		return
	}
	userApi.TokenNext(c, user)

}

func (userApi *UserApi) Login(c *gin.Context) {
	switch c.Query("flag") {
	case "email":
		userApi.EmailLogin(c)
	case "qq":
		userApi.QQLogin(c)
	default:
		userApi.EmailLogin(c)
	}
}

func (userApi *UserApi) EmailLogin(c *gin.Context) {
	var req request.Login
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if store.Verify(req.CaptchaID, req.Captcha, true) {
		u := database.User{Email: req.Email, Password: req.Password}
		user, err := userService.EmailLogin(u)
		if err != nil {
			global.Log.Error("Failedt to login:", zap.Error(err))
			response.FailWithMessage("Failed to login", c)
			return
		}
		userApi.TokenNext(c, user)
		return
	}
	response.FailWithMessage("Incorrect verfication code", c)
}
func (userApi *UserApi) QQLogin(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		response.FailWithMessage("Cdoe is required", c)
		return
	}
	accessTokenResponse, err := qqService.GetAccessTokenByCode(code)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	user, err := userService.QQLogin(accessTokenResponse)
	if err != nil {
		global.Log.Error("Failed to login:", zap.Error(err))
		response.FailWithMessage("Failed to login", c)
		return
	}
	userApi.TokenNext(c, user)

}

func (userApi *UserApi) TokenNext(c *gin.Context, user database.User) {
	// 检查用户是否被冻结
	if user.Freeze {
		response.FailWithMessage("The user is frozen, contact the administrator", c)
		return
	}

	baseClaims := request.BaseClaims{
		UserID: user.ID,
		UUID:   user.UUID,
		RoleID: user.RoleID,
	}

	j := utils.NewJWT()

	// 创建访问令牌
	accessClaims := j.CreateAccessClaims(baseClaims)
	accessToken, err := j.CreateAccessToken(accessClaims)
	if err != nil {
		global.Log.Error("Failed to get accessToken:", zap.Error(err))
		response.FailWithMessage("Failed to get accessToken", c)
		return
	}

	// 创建刷新令牌
	refreshClaims := j.CreateRefreshClaims(baseClaims)
	refreshToken, err := j.CreateRefreshToken(refreshClaims)
	if err != nil {
		global.Log.Error("Failed to get refreshToken:", zap.Error(err))
		response.FailWithMessage("Failed to get refreshToken", c)
		return
	}

	// 是否开启了多地点登录拦截
	if !global.Config.System.UseMultipoint {
		// 设置刷新令牌并返回
		utils.SetRefreshToken(c, refreshToken, int(refreshClaims.ExpiresAt.Unix()-time.Now().Unix()))
		c.Set("user_id", user.ID)
		response.OkWithDetailed(response.Login{
			User:                 user,
			AccessToken:          accessToken,
			AccessTokenExpiresAt: accessClaims.ExpiresAt.Unix() * 1000,
		}, "Successful login", c)
		return
	}

	// 检查 Redis 中是否已存在该用户的 JWT
	if jwtStr, err := jwtService.GetRedisJWT(user.UUID); errors.Is(err, redis.Nil) {
		// 不存在就设置新的
		if err := jwtService.SetRedisJWT(refreshToken, user.UUID); err != nil {
			global.Log.Error("Failed to set login status:", zap.Error(err))
			response.FailWithMessage("Failed to set login status", c)
			return
		}

		// 设置刷新令牌并返回
		utils.SetRefreshToken(c, refreshToken, int(refreshClaims.ExpiresAt.Unix()-time.Now().Unix()))
		c.Set("user_id", user.ID)
		response.OkWithDetailed(response.Login{
			User:                 user,
			AccessToken:          accessToken,
			AccessTokenExpiresAt: accessClaims.ExpiresAt.Unix() * 1000,
		}, "Successful login", c)
	} else if err != nil {
		// 出现错误处理
		global.Log.Error("Failed to set login status:", zap.Error(err))
		response.FailWithMessage("Failed to set login status", c)
	} else {
		// Redis 中已存在该用户的 JWT，将旧的 JWT 加入黑名单，并设置新的 token
		var blacklist database.JwtBlacklist
		blacklist.Jwt = jwtStr
		if err := jwtService.JoinInBlacklist(blacklist); err != nil {
			global.Log.Error("Failed to invalidate jwt:", zap.Error(err))
			response.FailWithMessage("Failed to invalidate jwt", c)
			return
		}

		// 设置新的 JWT 到 Redis
		if err := jwtService.SetRedisJWT(refreshToken, user.UUID); err != nil {
			global.Log.Error("Failed to set login status:", zap.Error(err))
			response.FailWithMessage("Failed to set login status", c)
			return
		}

		// 设置刷新令牌并返回
		utils.SetRefreshToken(c, refreshToken, int(refreshClaims.ExpiresAt.Unix()-time.Now().Unix()))
		c.Set("user_id", user.ID)
		response.OkWithDetailed(response.Login{
			User:                 user,
			AccessToken:          accessToken,
			AccessTokenExpiresAt: accessClaims.ExpiresAt.Unix() * 1000,
		}, "Successful login", c)
	}
}

func (userApi *UserApi) Logout(c *gin.Context) {}

func (userApi *UserApi) UserResetPassword(c *gin.Context) {}

func (userApi *UserApi) UserInfo(c *gin.Context) {}

func (userApi *UserApi) UserChangeInfo(c *gin.Context) {}

func (userApi *UserApi) UserWeather(c *gin.Context) {}

func (userApi *UserApi) UserChart(c *gin.Context) {}

func (userApi *UserApi) ForgotPassword(c *gin.Context) {}

func (userApi *UserApi) UserCard(c *gin.Context) {}

func (userApi *UserApi) UserList(c *gin.Context) {}

func (userApi *UserApi) UserFreeze(c *gin.Context) {}

func (userApi *UserApi) UserUnfreeze(c *gin.Context) {}

func (userApi *UserApi) UserLoginList(c *gin.Context) {}
