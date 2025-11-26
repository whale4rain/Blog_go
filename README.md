# whale4blog - 现代化博客系统

学习与使用目的的一个基于 Go 语言后端和 Next.js 前端的现代化博客系统，集成了高性能的 RESTful API 服务和现代化的服务端渲染前端界面。

## 🚀 项目特色

- **高性能后端**: 使用 Gin 框架构建的高性能 RESTful API
- **现代化前端**: Next.js 14 + TypeScript + Server-Side Rendering
- **全栈技术栈**: 集成数据库、缓存、搜索、文件存储等完整解决方案
- **响应式设计**: 基于 Google Material Design 的现代化 UI 设计
- **SEO 友好**: Next.js 原生服务端渲染，搜索引擎优化友好

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

### 前端技术栈 (Next.js + TypeScript)

- **框架**: Next.js 14 (App Router)
- **运行时**: React 18 + Server Components
- **构建工具**: Next.js (内置 Webpack/Turbopack)
- **状态管理**: Zustand
- **样式方案**: Tailwind CSS + Google Material Design
- **HTTP 客户端**: Axios
- **Markdown 渲染**: React Markdown + Syntax Highlighting
- **数学公式**: KaTeX
- **图表**: Mermaid
- **开发工具**: TypeScript + ESLint

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
├── blog-nextjs/           # Next.js 前端项目
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # 首页
│   │   ├── article/       # 文章页面
│   │   ├── dashboard/     # 后台管理
│   │   ├── login/         # 登录页面
│   │   └── search/        # 搜索页面
│   ├── components/        # React 组件
│   ├── lib/               # 工具库和 API
│   ├── public/            # 静态资源
│   ├── styles/            # 全局样式
│   ├── types/             # TypeScript 类型
│   ├── .next/             # 构建输出（自动生成）
│   ├── package.json       # 依赖配置
│   ├── next.config.js     # Next.js 配置
│   └── tailwind.config.ts # Tailwind 配置
│
└── web/                   # Vue 前端项目（旧版，已废弃）
```

## 🛠️ 安装与运行

### 环境要求

- Go 1.24+
- Node.js 18.0.0+
- npm 9.0.0+
- MySQL latest
- Redis latest
- Elasticsearch 8.17.0 (可选)
- PM2 (生产环境推荐)

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

#### 开发环境（本地测试）

1. **进入前端目录**
   ```bash
   cd blog-nextjs
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   # .env.local 已存在，默认配置：
   # NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
   # NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **运行开发服务器**
   ```bash
   npm run dev
   # 访问 http://localhost:3000
   ```

5. **构建生产版本（本地测试）**
   ```bash
   npm run build
   npm run start
   ```

#### 生产环境部署（服务器）

**重要**: Next.js 不是静态网站，需要 Node.js 服务器运行！

##### 方式一：快速部署（Windows 本地）
```powershell
# 运行一键部署脚本
.\deploy-frontend.ps1
# 选择选项 2 使用 PM2 管理
```

##### 方式二：服务器部署（推荐）

1. **准备服务器环境**
   ```bash
   # 安装 Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # 安装 PM2
   sudo npm install -g pm2
   ```

2. **上传项目到服务器**
   ```bash
   # 方式 A: 使用 Git
   cd /var/www/
   git clone <repository-url> whale4blog
   cd whale4blog/blog-nextjs
   
   # 方式 B: 使用 SCP/FTP
   # 上传整个 blog-nextjs 文件夹到服务器
   ```

3. **配置生产环境变量**
   ```bash
   cd /var/www/whale4blog/blog-nextjs
   nano .env.production
   
   # 填入以下内容（替换为你的实际域名）：
   # NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
   # NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **构建并启动**
   ```bash
   # 安装依赖
   npm install
   
   # 构建生产版本
   npm run build
   
   # 使用 PM2 启动（推荐）
   pm2 start npm --name "whale4blog-frontend" -- start
   pm2 save
   pm2 startup
   
   # 查看状态
   pm2 list
   pm2 logs whale4blog-frontend
   ```

5. **配置 Nginx 反向代理**
   ```nginx
   # /etc/nginx/sites-available/whale4blog
   server {
       listen 80;
       server_name yourdomain.com;
       
       # 前端 Next.js (反向代理到 Node.js)
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # 后端 API
       location /api {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
       }
       
       # 上传文件
       location /uploads {
           proxy_pass http://localhost:8080;
       }
   }
   ```
   
   启用配置：
   ```bash
   sudo ln -s /etc/nginx/sites-available/whale4blog /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **配置 SSL 证书（推荐）**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

##### 部署说明文档

详细的部署指南请查看：
- **`NGINX_DEPLOYMENT.md`** - Nginx 反向代理完整配置指南
- **`VUE_VS_NEXTJS.md`** - Vue 静态部署 vs Next.js SSR 部署对比
- **`DEPLOYMENT_CHECKLIST.md`** - 快速部署检查清单
- **`DEPLOYMENT_GUIDE.md`** - 综合部署文档

##### 常用部署命令

```bash
# 查看服务状态
pm2 list

# 查看日志
pm2 logs whale4blog-frontend

# 重启服务
pm2 restart whale4blog-frontend

# 停止服务
pm2 stop whale4blog-frontend

# 更新部署
cd /var/www/whale4blog
git pull
cd blog-nextjs
npm install
npm run build
pm2 restart whale4blog-frontend
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
- ✅ 服务端渲染 (SSR)
- ✅ 响应式设计（移动端适配）
- ✅ 文章列表与详情
- ✅ Markdown 渲染与代码高亮
- ✅ 数学公式支持 (KaTeX)
- ✅ 图表渲染 (Mermaid)
- ✅ 文章目录导航
- ✅ 用户登录/注册
- ✅ 后台管理系统
- ✅ 文章 CRUD 操作
- ✅ 图片上传管理
- ✅ 评论管理
- ✅ 全文搜索
- ✅ Google Material Design 风格

## 🎨 设计系统

项目采用 Google Material Design 设计规范：
- **配色方案**: Google Blue, Green, Red, Yellow
- **排版**: 清晰的层级结构和间距
- **交互**: 流畅的动画和过渡效果
- **响应式**: 移动优先的设计理念

## 🚀 性能优化

### Next.js 优化特性
- ✅ 服务端渲染 (SSR)
- ✅ 静态站点生成 (SSG)
- ✅ 增量静态再生成 (ISR)
- ✅ 图片自动优化
- ✅ 代码分割和懒加载
- ✅ CSS 优化 (Tailwind CSS)

### 后端优化
- ✅ Redis 缓存
- ✅ 数据库查询优化
- ✅ Elasticsearch 全文搜索
- ✅ 七牛云 CDN 加速

## 📱 访问地址

- **前端地址**: http://localhost:3000
- **后端 API**: http://localhost:8080/api
- **后台管理**: http://localhost:3000/dashboard



## 🙏 致谢

本项目学习自：
- [github.com/scc749/go_blog.git](https://github.com/scc749/go_blog.git) - 原始 Go + Vue 项目

前端已重构为 Next.js，提供更好的 SEO 和性能表现。

感谢以下开源项目的贡献：
- **后端**: Gin, GORM, Redis, Elasticsearch
- **前端**: Next.js, React, Tailwind CSS, Zustand
- 以及其他所有依赖的库和工具

## 📧 联系方式

- **项目仓库**: https://github.com/whale4rain/Blog_go
- **邮箱**: contact@whale4blog.com

---

**Happy Coding!** 🎉
