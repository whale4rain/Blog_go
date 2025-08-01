package request

type PageInfo struct {
	Page     int `josn:"page" form:"page"`
	PageSize int `json:"page_size" form:"page_size"`
}
