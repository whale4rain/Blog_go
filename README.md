# Go Blog - 现代化博客系统

学习与使用目的的一个基于 Go 语言后端和 Vue 3 前端的现代化博客系统，集成了高性能的 RESTful API 服务和现代化的 Web 前端界面。

## 🚀 项目特色

- **高性能后端**: 使用 Gin 框架构建的高性能 RESTful API
- **现代化前端**: Vue 3 + TypeScript + Pinia 状态管理
- **全栈技术栈**: 集成数据库、缓存、搜索、文件存储等完整解决方案
- **响应式设计**: 基于 Element Plus 的现代化 UI 设计
- **SEO 友好**: 支持搜索引擎优化和内容发现

## 📦 技术栈

### 后端技术栈 (Go)

- **Web 框架**:
  - [Gin](https://github.com/gin-gonic/gin) - 高性能 Go web 框架
  - [Gin-Contrib Sessions](https://github.com/gin-contrib/sessions) - 会话管理

- **数据库**:
  - [GORM](https://gorm.io/) - Go ORM 库
  - MySQL - 关系型数据库

- **身份验证**:
  - [JWT](https://github.com/golang-jwt/jwt/v4) - JSON Web Tokens 认证

- **缓存与存储**:
  - [Go-Redis](https://github.com/go-redis/redis) - Redis 客户端
  - [Qiniu SDK](https://github.com/qiniu/go-sdk/v7) - 七牛云文件存储

- **搜索**:
  - [Elasticsearch Go](https://github.com/elastic/go-elasticsearch/v8) - Elasticsearch 集成

- **日志**:
  - [Zap](https://go.uber.org/zap) - 高性能日志库

- **其他工具**:
  - [Cron](https://github.com/robfig/cron/v3) - 定时任务调度
  - [Base64Captcha](https://github.com/mojocn/base64Captcha) - 验证码生成
  - [Email](https://github.com/jordan-wright/email) - 邮件发送

### 前端技术栈 (Vue 3 + TypeScript)

- **框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI 组件库**: Element Plus
- **HTTP 客户端**: Axios
- **数据可视化**: ECharts
- **样式预处理器**: Sass
- **开发工具**: TypeScript + Vue-TSC

## 📁 项目结构

```
go_blog/
├── server/                 # Go 后端服务
│   ├── api/               # API 控制器
│   ├── config/            # 配置文件
│   ├── core/              # 核心组件
│   ├── global/            # 全局变量
│   ├── initialize/        # 初始化逻辑
│   ├── middleware/        # 中间件
│   ├── model/             # 数据模型
│   ├── router/            # 路由定义
│   ├── service/           # 业务逻辑
│   ├── task/              # 定时任务
│   ├── uploads/           # 文件上传目录
│   ├── utils/             # 工具函数
│   ├── config.yaml        # 配置文件
│   ├── go.mod             # Go 模块定义
│   └── main.go            # 入口文件
│
└── web/                   # Vue 前端项目
    ├── src/               # 源代码目录
    ├── public/            # 静态资源
    ├── dist/              # 构建输出
    ├── package.json       # 依赖配置
    └── vite.config.ts     # Vite 配置
```

## 🛠️ 安装与运行

### 环境要求

- Go 1.24+
- Node.js latest
- MySQL latest
- Redis latest
- Elasticsearch 8.17.0 (⭐)

### 后端启动

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd go_blog/server
   ```

2. **安装依赖**
   ```bash
   go mod download
   ```

3. **配置环境**
   ```bash
   # 复制并修改配置文件
   cp config.yaml.example config.yaml
   # 编辑 config.yaml 文件，配置数据库、Redis 等连接信息
   ```

4. **初始化数据库**
   ```bash
   # 执行 SQL 文件初始化数据库
   mysql -u root -p < mysql_20250808.sql
   ```

5. **运行服务**
   ```bash
   # 开发模式
   go run main.go

   # 生产模式
   go build -o main
   ./main
   ```

### 前端启动

1. **进入前端目录**
   ```bash
   cd ../web
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境**
   ```bash
   # 创建环境配置文件（如果需要）
   cp .env.example .env
   # 编辑 .env 文件，配置 API 地址等
   ```

4. **运行开发服务器**
   ```bash
   npm run dev
   ```

5. **构建生产版本**
   ```bash
   npm run build
   ```


## 📋 功能特性

### 后端功能
- ✅ 用户认证与授权 (JWT)
- ✅ 文章管理 (CRUD)
- ✅ 分类与标签管理
- ✅ 评论系统
- ✅ 文件上传 (本地+七牛云)
- ✅ 数据缓存 (Redis)
- ✅ 全文搜索 (Elasticsearch)
- ✅ 定时任务 (Cron)
- ✅ 邮件通知
- ✅ API 文档 (Swagger/OpenAPI)

### 前端功能
- ✅ 响应式布局
- ✅ 文章列表与详情
- ✅ 用户登录/注册
- ✅ 后台管理系统
- ✅ 富文本编辑器
- ✅ 数据可视化图表
- ✅ 暗色/亮色主题
- ✅ 国际化支持



## 🙏 致谢

学习自：
github.com/scc749/go_blog.git

感谢以下开源项目的贡献：
- Gin Web Framework
- Vue.js
- Element Plus
- 以及其他所有依赖的库和工具
---

**Happy Coding!** 🎉
