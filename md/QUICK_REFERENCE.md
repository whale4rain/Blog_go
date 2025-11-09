# 快速参考指南 - 前后端对接

## 🚀 快速启动

### 启动后端
```bash
cd server
go run main.go
# 或使用编译后的可执行文件
./main.exe  # Windows
./main      # Linux/Mac
```

后端地址: http://localhost:8080

### 启动前端
```bash
cd blog-nextjs
npm install  # 首次运行
npm run dev
```

前端地址: http://localhost:3000

### 测试连接
```bash
cd blog-nextjs
node scripts/test-api.js
```

---

## 📡 API 配置

### Base URL
```
http://localhost:8080/api
```

### 响应格式
```json
{
  "code": 0,        // 0=成功, 7=失败
  "data": {},       // 数据
  "msg": "success"  // 消息
}
```

### 认证
- Token存储: `localStorage.access_token`
- 请求头: `Authorization: Bearer <token>`

---

## 🔑 常用 API

### 用户相关
```typescript
// 登录
POST /api/user/login
{ email, password, captcha?, captcha_id? }

// 注册
POST /api/user/register
{ username, email, password, verification_code }

// 获取用户信息 (需登录)
GET /api/user/info

// 登出 (需登录)
POST /api/user/logout
```

### 文章相关
```typescript
// 搜索文章 (公开)
GET /api/article/search?query=xxx&category=xxx&page=1&page_size=10

// 文章详情 (公开)
GET /api/article/:id

// 分类统计 (公开)
GET /api/article/category

// 标签统计 (公开)
GET /api/article/tags

// 创建文章 (管理员)
POST /api/article/create

// 更新文章 (管理员)
PUT /api/article/update
{ id, title, content, ... }

// 删除文章 (管理员)
DELETE /api/article/delete
{ ids: [1, 2, 3] }
```

### 评论相关
```typescript
// 获取文章评论 (公开)
GET /api/comment/:article_id

// 发表评论 (需登录)
POST /api/comment/create
{ article_id, content, parent_id }

// 删除评论 (需登录)
DELETE /api/comment/delete
{ ids: [1, 2, 3] }
```

### 其他接口
```typescript
// 获取验证码 (公开)
POST /api/base/captcha

// 发送邮箱验证码 (公开)
POST /api/base/sendEmailVerificationCode
{ email, captcha, captcha_id }

// 上传图片 (管理员)
POST /api/image/upload
FormData: { file }

// 网站信息 (公开)
GET /api/website/info
GET /api/website/logo
GET /api/website/title

// 友链 (公开)
GET /api/friendLink/info
```

---

## 💻 代码示例

### 用户登录
```typescript
import { login } from '@/lib/api/user';
import { useUserStore } from '@/lib/store/userStore';

const handleLogin = async () => {
  const result = await login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  const userStore = useUserStore();
  userStore.setUser(result.user);
  userStore.setToken(result.access_token);
};
```

### 获取文章列表
```typescript
import { searchArticles } from '@/lib/api/article';

const fetchArticles = async () => {
  const result = await searchArticles({
    page: 1,
    page_size: 10,
    category: 'frontend'
  });
  
  return result.list;
};
```

### 发表评论
```typescript
import { createComment } from '@/lib/api/comment';

const postComment = async (articleId: number, content: string) => {
  await createComment({
    article_id: articleId,
    content: content,
    parent_id: 0
  });
};
```

---

## 🔧 调试技巧

### 查看 Token
```javascript
// 浏览器控制台
console.log(localStorage.getItem('access_token'));
```

### 清除缓存
```javascript
// 浏览器控制台
localStorage.clear();
```

### 测试 API
```bash
# 测试网站信息
curl http://localhost:8080/api/website/info

# 测试文章分类
curl http://localhost:8080/api/article/category

# 测试登录
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 查看后端日志
```bash
# 实时查看 (Linux/Mac)
tail -f server/log/go_blog.log

# 查看最后50行
tail -n 50 server/log/go_blog.log
```

---

## ⚠️ 常见问题

### 401 Unauthorized
```javascript
// 清除旧token重新登录
localStorage.removeItem('access_token');
localStorage.removeItem('user');
```

### 404 Not Found
- 检查API路径是否正确
- 确认后端服务正在运行
- 参考 API_INTEGRATION.md

### CORS 错误
- 后端已配置CORS
- 确保后端正常启动

### 图片上传失败
- 检查文件大小 (限制20MB)
- 确保 server/uploads 目录存在
- 查看后端日志

---

## 📂 项目结构

```
go_blog/
├── server/              # 后端 Go 代码
│   ├── api/            # API 处理器
│   ├── router/         # 路由配置
│   ├── config.yaml     # 配置文件
│   └── main.go         # 入口文件
│
└── blog-nextjs/        # 前端 Next.js 代码
    ├── app/            # 页面路由
    ├── components/     # React 组件
    ├── lib/
    │   ├── api/       # API 调用
    │   ├── store/     # 状态管理
    │   └── utils/     # 工具函数
    └── .env.local      # 环境配置
```

---

## 📚 完整文档

- **API_INTEGRATION.md** - 完整API对接文档
- **BACKEND_INTEGRATION_COMPLETE.md** - 修改记录和详细说明
- **README.md** - 项目介绍
- **QUICK_START.md** - 快速开始指南

---

## ✅ 测试清单

基础功能:
- [ ] 访问首页
- [ ] 查看文章列表
- [ ] 查看文章详情
- [ ] 搜索文章

用户功能:
- [ ] 用户注册
- [ ] 用户登录
- [ ] 查看用户信息
- [ ] 修改用户信息
- [ ] 用户登出

交互功能:
- [ ] 发表评论
- [ ] 文章点赞
- [ ] 查看评论列表

管理功能 (需管理员):
- [ ] 创建文章
- [ ] 编辑文章
- [ ] 删除文章
- [ ] 上传图片
- [ ] 用户管理

---

## 🎯 下一步

1. **立即测试**: 运行测试脚本验证连接
2. **功能测试**: 按测试清单逐项验证
3. **问题排查**: 查看日志和网络请求
4. **功能完善**: 根据需求添加新功能

---

## 💡 提示

- Mock API 已禁用，使用真实后端
- 所有API请求需要后端运行
- 管理员功能需要管理员权限
- Token 有效期: 2小时

---

**版本**: 1.0.0
**最后更新**: 2024