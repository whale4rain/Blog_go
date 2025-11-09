# 后端 API 对接完成指南

## ✅ 已完成的修改

本文档总结了为实现前后端正确对接所做的所有修改。

---

## 📋 修改清单

### 1. API 客户端修复 ✅

**文件**: `blog-nextjs/lib/api/client.ts`

**修改内容**:
- 修正响应拦截器的成功判断条件
- 从 `code === 200 || code === 0` 改为 `code === 0`
- 匹配后端实际返回的成功状态码

```typescript
// 修改前
if (data.code === 200 || data.code === 0) {
  return response;
}

// 修改后
if (data.code === 0) {
  return response;
}
```

---

### 2. 禁用 Mock API ✅

**文件**: `blog-nextjs/lib/api/mock/index.ts`

**修改内容**:
- 将 `USE_MOCK_API` 设置为 `false`
- 所有 API 请求现在都会发送到真实后端

```typescript
// 修改前
export const USE_MOCK_API = true;

// 修改后
export const USE_MOCK_API = false;
```

---

### 3. 文章 API 路径修正 ✅

**文件**: `blog-nextjs/lib/api/article.ts`

**修改内容**:
- 修正 `updateArticle` 路径: `/article/:id` → `/article/update`
- 修正 `deleteArticle` 路径: `/article/:id` → `/article/delete`
- 匹配后端路由定义

```typescript
// updateArticle - 修改前
return put<Article>(`/article/${id}`, data);

// updateArticle - 修改后
return put<Article>("/article/update", { id, ...data });

// deleteArticle - 修改前
return del<void>(`/article/${id}`);

// deleteArticle - 修改后
return del<void>("/article/delete", {
  data: { ids: [id] },
});
```

---

### 4. 评论 API 路径修正 ✅

**文件**: `blog-nextjs/lib/api/comment.ts`

**修改内容**:
- 修正 `getCommentList` 使用动态路由参数
- 修正 `getCaptcha` 路径去掉多余的 `api` 前缀

```typescript
// getCommentList - 修改前
return get<PaginatedResponse<Comment>>(`/comment/list?${query.toString()}`);

// getCommentList - 修改后
return get<PaginatedResponse<Comment>>(`/comment/${params.article_id}`);

// getCaptcha - 修改前
return post<CaptchaResponse>("api/base/captcha");

// getCaptcha - 修改后
return post<CaptchaResponse>("/base/captcha");
```

---

### 5. 友链 API 路径修正 ✅

**文件**: `blog-nextjs/lib/api/comment.ts`

**修改内容**:
- 将所有 `/friend-link` 改为 `/friendLink`（匹配后端驼峰命名）
- 修正公开友链接口路径

```typescript
// 修改前
POST /friend-link/create
PUT  /friend-link/update
DELETE /friend-link/delete
GET  /friend-link/list
GET  /friend-link/footer

// 修改后
POST /friendLink/create
PUT  /friendLink/update
DELETE /friendLink/delete
GET  /friendLink/list
GET  /friendLink/info
```

---

### 6. 网站信息 API 完善 ✅

**文件**: `blog-nextjs/lib/api/comment.ts`

**新增功能**:
- 添加 `getWebsiteLogo()` - 获取网站 Logo
- 添加 `getWebsiteTitle()` - 获取网站标题
- 添加 `getWebsiteCarousel()` - 获取轮播图
- 添加 `getWebsiteNews()` - 获取最新动态
- 添加 `getWebsiteFooterLinks()` - 获取底部链接

---

### 7. 环境配置文件创建 ✅

**文件**: `blog-nextjs/.env.local`

**内容**:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Inspiration Blog
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 8. 文档创建 ✅

**新增文件**:
1. `blog-nextjs/API_INTEGRATION.md` - 完整的 API 对接文档
2. `blog-nextjs/scripts/test-api.js` - API 连接测试脚本
3. `BACKEND_INTEGRATION_COMPLETE.md` - 本文档

---

## 🎯 后端 API 结构说明

### Base URL
```
http://localhost:8080/api
```

### 响应格式
```json
{
  "code": 0,        // 0=成功, 7=失败
  "data": {},       // 响应数据
  "msg": "success"  // 响应消息
}
```

### 认证方式
- JWT Bearer Token
- 存储位置: `localStorage.access_token`
- 请求头: `Authorization: Bearer <token>`

---

## 🚀 快速启动

### 1. 启动后端服务

```bash
# 进入后端目录
cd server

# 方式 1: 使用 Go 运行
go run main.go

# 方式 2: 使用编译后的可执行文件 (Windows)
./main.exe

# 方式 3: 使用编译后的可执行文件 (Linux/Mac)
./main
```

后端将在 `http://localhost:8080` 启动

### 2. 启动前端服务

```bash
# 进入前端目录
cd blog-nextjs

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

前端将在 `http://localhost:3000` 启动

### 3. 测试 API 连接

```bash
# 在 blog-nextjs 目录下运行
node scripts/test-api.js
```

---

## 🧪 测试清单

按照以下顺序测试功能：

### 基础功能测试
- [ ] 访问首页 `http://localhost:3000`
- [ ] 检查文章列表是否正常加载
- [ ] 检查分类和标签是否显示
- [ ] 测试文章搜索功能

### 文章相关测试
- [ ] 点击文章进入详情页
- [ ] 检查文章内容是否完整显示
- [ ] 测试文章点赞功能（需登录）
- [ ] 查看文章评论列表

### 用户功能测试
- [ ] 点击"注册"按钮
- [ ] 填写注册信息
- [ ] 获取邮箱验证码
- [ ] 完成注册流程
- [ ] 测试登录功能
- [ ] 查看用户信息页面
- [ ] 测试登出功能

### 评论功能测试
- [ ] 登录后进入文章详情页
- [ ] 发表评论
- [ ] 查看评论是否显示
- [ ] 测试回复评论（如果实现）

### 管理功能测试（需要管理员账号）
- [ ] 访问 `/dashboard`
- [ ] 测试文章创建
- [ ] 测试文章编辑
- [ ] 测试文章删除
- [ ] 测试图片上传
- [ ] 测试用户管理

---

## 🔍 调试技巧

### 1. 查看网络请求

打开浏览器开发者工具 (F12)：
- **Network** 标签：查看所有 API 请求
- **Console** 标签：查看错误信息
- **Application** 标签：查看 localStorage 中的 token

### 2. 查看后端日志

```bash
# 实时查看日志 (Linux/Mac)
tail -f server/log/go_blog.log

# 查看最后 100 行 (Windows)
Get-Content server/log/go_blog.log -Tail 100 -Wait
```

### 3. 检查 Token

在浏览器控制台执行：
```javascript
// 查看 token
console.log(localStorage.getItem('access_token'));

// 查看用户信息
console.log(localStorage.getItem('user'));

// 清除所有缓存（重新登录时使用）
localStorage.clear();
```

### 4. 测试单个 API 端点

使用 curl 或 Postman 测试：
```bash
# 测试获取网站信息
curl http://localhost:8080/api/website/info

# 测试获取文章分类
curl http://localhost:8080/api/article/category

# 测试登录（替换为实际的邮箱和密码）
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## ⚠️ 常见问题

### 问题 1: CORS 错误

**症状**: 浏览器控制台显示 CORS policy 错误

**解决方案**:
- 确认后端已配置 CORS 中间件
- 检查 `server/initialize/router.go` 中是否有 CORS 配置
- 后端通常已经配置了允许所有来源的 CORS

### 问题 2: 401 Unauthorized

**症状**: API 请求返回 401 错误

**原因**:
- Token 已过期
- Token 格式不正确
- 未登录访问需要认证的接口

**解决方案**:
```javascript
// 1. 清除旧 token
localStorage.removeItem('access_token');
localStorage.removeItem('user');

// 2. 重新登录获取新 token
// 3. 确认访问的接口不需要特殊权限
```

### 问题 3: 404 Not Found

**症状**: API 请求返回 404 错误

**原因**:
- API 路径不正确
- 后端服务未启动
- 路由配置错误

**解决方案**:
1. 检查 API 路径是否正确（参考 `API_INTEGRATION.md`）
2. 确认后端服务正在运行
3. 查看后端控制台输出

### 问题 4: 验证码相关错误

**症状**: 注册时提示验证码错误

**原因**:
- 验证码已过期（通常 5 分钟有效）
- 邮箱配置不正确
- 验证码输入错误

**解决方案**:
1. 检查 `server/config.yaml` 中的邮箱配置
2. 确认邮箱服务密钥正确
3. 重新获取验证码
4. 检查邮箱垃圾邮件文件夹

### 问题 5: 图片上传失败

**症状**: 上传图片时报错

**原因**:
- 文件大小超过限制（默认 20MB）
- uploads 目录权限不足
- 文件类型不支持

**解决方案**:
1. 检查文件大小
2. 确保 `server/uploads` 目录存在且有写权限
3. 查看后端日志获取详细错误信息

---

## 📊 API 端点对照表

### 公开接口（无需登录）

| 功能 | 方法 | 路径 |
|------|------|------|
| 网站信息 | GET | `/api/website/info` |
| 文章列表 | GET | `/api/article/search` |
| 文章详情 | GET | `/api/article/:id` |
| 文章分类 | GET | `/api/article/category` |
| 文章标签 | GET | `/api/article/tags` |
| 评论列表 | GET | `/api/comment/:article_id` |
| 友链列表 | GET | `/api/friendLink/info` |
| 用户注册 | POST | `/api/user/register` |
| 用户登录 | POST | `/api/user/login` |

### 私有接口（需要登录）

| 功能 | 方法 | 路径 |
|------|------|------|
| 获取用户信息 | GET | `/api/user/info` |
| 修改用户信息 | PUT | `/api/user/changeInfo` |
| 用户登出 | POST | `/api/user/logout` |
| 发表评论 | POST | `/api/comment/create` |
| 删除评论 | DELETE | `/api/comment/delete` |
| 点赞文章 | POST | `/api/article/like` |
| 检查点赞 | GET | `/api/article/isLike` |
| 创建反馈 | POST | `/api/feedback/create` |

### 管理员接口（需要管理员权限）

| 功能 | 方法 | 路径 |
|------|------|------|
| 创建文章 | POST | `/api/article/create` |
| 更新文章 | PUT | `/api/article/update` |
| 删除文章 | DELETE | `/api/article/delete` |
| 文章管理列表 | GET | `/api/article/list` |
| 上传图片 | POST | `/api/image/upload` |
| 图片管理 | GET | `/api/image/list` |
| 用户管理 | GET | `/api/user/list` |
| 评论管理 | GET | `/api/comment/list` |

---

## 🎓 使用示例

### 示例 1: 获取并显示文章列表

```typescript
import { searchArticles } from '@/lib/api/article';

async function fetchArticles() {
  try {
    const result = await searchArticles({
      page: 1,
      page_size: 10,
      category: 'frontend'
    });
    
    console.log('文章列表:', result.list);
    console.log('总数:', result.total);
    
    return result.list;
  } catch (error) {
    console.error('获取文章失败:', error);
    return [];
  }
}
```

### 示例 2: 用户登录

```typescript
import { login } from '@/lib/api/user';
import { useUserStore } from '@/lib/store/userStore';

async function handleLogin(email: string, password: string) {
  try {
    const userInfo = await login({
      email,
      password,
      captcha: '1234',
      captcha_id: 'xxx'
    });
    
    // 保存用户信息到状态管理
    const userStore = useUserStore();
    userStore.setUser(userInfo.user);
    userStore.setToken(userInfo.access_token);
    
    console.log('登录成功!');
    return true;
  } catch (error) {
    console.error('登录失败:', error);
    return false;
  }
}
```

### 示例 3: 发表评论

```typescript
import { createComment } from '@/lib/api/comment';

async function postComment(articleId: number, content: string) {
  try {
    const comment = await createComment({
      article_id: articleId,
      content: content,
      parent_id: 0  // 0 表示顶级评论
    });
    
    console.log('评论发表成功:', comment);
    return comment;
  } catch (error) {
    console.error('评论失败:', error);
    throw error;
  }
}
```

---

## 📝 下一步建议

### 立即测试
1. 运行 API 测试脚本确认连接
2. 测试用户注册和登录流程
3. 浏览文章列表和详情页

### 功能完善
1. 完善错误提示 UI
2. 添加加载状态指示器
3. 实现更多交互功能
4. 优化移动端体验

### 性能优化
1. 添加 API 响应缓存
2. 实现图片懒加载
3. 优化首屏加载速度
4. 添加骨架屏

### 安全增强
1. 实现请求签名
2. 添加防重放攻击
3. 完善 XSS 防护
4. 添加请求频率限制

---

## 📞 获取帮助

如果遇到问题：

1. **查看文档**:
   - `API_INTEGRATION.md` - 完整 API 文档
   - `README.md` - 项目说明
   - `QUICK_START.md` - 快速开始指南

2. **查看日志**:
   - 前端: 浏览器控制台
   - 后端: `server/log/go_blog.log`

3. **运行测试**:
   ```bash
   node scripts/test-api.js
   ```

4. **检查配置**:
   - 后端: `server/config.yaml`
   - 前端: `blog-nextjs/.env.local`

---

## ✅ 完成确认

- [x] API 客户端响应拦截器已修复
- [x] Mock API 已禁用
- [x] 所有 API 路径已匹配后端路由
- [x] 环境配置文件已创建
- [x] API 测试脚本已准备
- [x] 完整文档已编写

**状态**: ✅ 前后端对接已完成，可以开始测试！

---

**创建时间**: 2024
**最后更新**: 2024
**版本**: 1.0.0