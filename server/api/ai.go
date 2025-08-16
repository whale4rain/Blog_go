package api

import (
	"context"
	"fmt"
	"net/http"
	"server/global"
	"server/model/request"
	"strings"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"
)

type AIApi struct {
	client *openai.Client
}

// 初始化openai client
func (aiApi *AIApi) NewAIApi() *AIApi {
	token := global.Config.AI.Key
	cfg := openai.DefaultConfig(token)
	cfg.BaseURL = global.Config.AI.BaseURL
	return &AIApi{
		client: openai.NewClientWithConfig(cfg),
	}
}

// ai生成所需数据(abstract, catrgory, tags...)
func (api *AIApi) AiGenerateMeta(c *gin.Context) {
	var req request.AiReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := fmt.Sprintf(`请根据以下文章返回一行合法的 JSON,不要使用md的格式，我只需要json文本：{"title":"<30字>","summary":"<150字>","category":"","tags":[]} 正文：%s`, req.Content)
	resp, err := api.client.CreateChatCompletion(context.Background(),
		openai.ChatCompletionRequest{
			Model: "deepseek-chat",
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: prompt},
			},
			MaxTokens:   600,
			Temperature: 0.7,
		})
	if err != nil {
		fmt.Printf("[DEBUG] deepseek error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	raw := resp.Choices[0].Message.Content
	// 去掉 ```json 和 ```
	clean := strings.TrimSpace(raw)
	clean = strings.TrimPrefix(clean, "```json")
	clean = strings.TrimSuffix(clean, "```")
	clean = strings.TrimSpace(clean)

	c.Data(http.StatusOK, "application/json", []byte(clean))
}
