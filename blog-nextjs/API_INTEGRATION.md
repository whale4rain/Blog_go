# API Integration Guide

## 概述

本文档说明了前端 Next.js 应用如何与后端 Go API 进行对接。

## 后端 API 配置

### 服务器信息
- **Host**: `0.0.0.0`
- **Port**: `8080`
- **Base URL**: `http://localhost:8080/api`
- **路由前缀**: `/api`

### 响应格式
所有 API 响应遵循统一格式：

```json
{
  "code": 0,        // 0=成功, 7=失败
  "data": {},       // 响应数据
  "msg": "success"  // 响应消息
}
```

### 认证方式
- 使用 JWT Bearer Token
- Token 存储在 localStorage 的 `access_token` 字段
- 请求头格式: `Authorization: Bearer <token>`

## 前端配置

### 环境变量
在 `.env.local` 文件中配置：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### API Client 配置
位置: `lib/api/client.ts`

- 自动添加 Authorization 头
- 401 错误自动跳转登录页
- 统一错误处理

### 禁用 Mock API
在 `lib/api/mock/index.ts` 中设置：

```typescript
export const USE_MOCK_API = false;
```

## API 路由对照表

### 用户相关 (User)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 登录 | `login()` | POST | `/api/user/login` | Public |
| 注册 | `register()` | POST | `/api/user/register` | Public |
| 登出 | `logout()` | POST | `/api/user/logout` | Private |
| 获取用户信息 | `getUserInfo()` | GET | `/api/user/info` | Private |
| 修改用户信息 | `updateUserInfo()` | PUT | `/api/user/changeInfo` | Private |
| 忘记密码 | `forgotPassword()` | POST | `/api/user/forgotPassword` | Public |
| 重置密码 | `resetPassword()` | PUT | `/api/user/resetPassword` | Private |
| 用户卡片 | `getUserCard()` | GET | `/api/user/card?uuid=xxx` | Public |
| 用户列表 | `getUserList()` | GET | `/api/user/list` | Admin |

### 文章相关 (Article)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 创建文章 | `createArticle()` | POST | `/api/article/create` | Admin |
| 更新文章 | `updateArticle()` | PUT | `/api/article/update` | Admin |
| 删除文章 | `deleteArticle()` | DELETE | `/api/article/delete` | Admin |
| 文章详情 | `getArticleById()` | GET | `/api/article/:id` | Public |
| 搜索文章 | `searchArticles()` | GET | `/api/article/search` | Public |
| 文章列表 | `getArticleList()` | GET | `/api/article/list` | Admin |
| 分类统计 | `getCategoryStats()` | GET | `/api/article/category` | Public |
| 标签统计 | `getTagStats()` | GET | `/api/article/tags` | Public |
| 点赞文章 | `likeArticle()` | POST | `/api/article/like` | Private |
| 检查点赞 | `checkIsLiked()` | GET | `/api/article/isLike` | Private |

### 评论相关 (Comment)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 创建评论 | `createComment()` | POST | `/api/comment/create` | Private |
| 删除评论 | `deleteComments()` | DELETE | `/api/comment/delete` | Private |
| 文章评论列表 | `getCommentList()` | GET | `/api/comment/:article_id` | Public |
| 最新评论 | - | GET | `/api/comment/new` | Public |
| 评论管理列表 | - | GET | `/api/comment/list` | Admin |

### 图片相关 (Image)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 上传图片 | `uploadImage()` | POST | `/api/image/upload` | Admin |
| 删除图片 | `deleteImages()` | DELETE | `/api/image/delete` | Admin |
| 图片列表 | `getImageList()` | GET | `/api/image/list` | Admin |

### 友链相关 (FriendLink)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 创建友链 | `createFriendLink()` | POST | `/api/friendLink/create` | Admin |
| 更新友链 | `updateFriendLink()` | PUT | `/api/friendLink/update` | Admin |
| 删除友链 | `deleteFriendLinks()` | DELETE | `/api/friendLink/delete` | Admin |
| 友链列表 | `getFriendLinkList()` | GET | `/api/friendLink/list` | Admin |
| 公开友链 | `getFooterFriendLinks()` | GET | `/api/friendLink/info` | Public |

### 反馈相关 (Feedback)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 创建反馈 | `createFeedback()` | POST | `/api/feedback/create` | Private |
| 回复反馈 | `replyFeedback()` | PUT | `/api/feedback/reply` | Admin |
| 反馈列表 | `getFeedbackList()` | GET | `/api/feedback/list` | Admin |

### 广告相关 (Advertisement)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 创建广告 | `createAdvertisement()` | POST | `/api/advertisement/create` | Admin |
| 更新广告 | `updateAdvertisement()` | PUT | `/api/advertisement/update` | Admin |
| 删除广告 | `deleteAdvertisements()` | DELETE | `/api/advertisement/delete` | Admin |
| 广告列表 | `getAdvertisementList()` | GET | `/api/advertisement/list` | Admin |
| 公开广告 | - | GET | `/api/advertisement/info` | Public |

### 网站信息 (Website)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 网站信息 | `getWebsiteInfo()` | GET | `/api/website/info` | Public |
| 网站Logo | `getWebsiteLogo()` | GET | `/api/website/logo` | Public |
| 网站标题 | `getWebsiteTitle()` | GET | `/api/website/title` | Public |
| 轮播图 | `getWebsiteCarousel()` | GET | `/api/website/carousel` | Public |
| 最新动态 | `getWebsiteNews()` | GET | `/api/website/news` | Public |
| 底部链接 | `getWebsiteFooterLinks()` | GET | `/api/website/footerLink` | Public |

### 基础功能 (Base)

| 功能 | 前端方法 | HTTP | 后端路径 | 权限 |
|------|---------|------|---------|------|
| 获取验证码 | `getCaptcha()` | POST | `/api/base/captcha` | Public |
| 发送邮箱验证码 | `sendEmailVerificationCode()` | POST | `/api/base/sendEmailVerificationCode` | Public |
| QQ登录URL | `getQQLoginURL()` | GET | `/api/base/qqLoginURL` | Public |

## 使用示例

### 1. 用户登录

```typescript
import { login } from '@/lib/api/user';
import { useUserStore } from '@/lib/store/userStore';

// 组件中
const handleLogin = async () => {
  try {
    const result = await login({
      email: 'user@example.com',
      password: 'password123',
      captcha: '1234',
      captcha_id: 'xxx'
    });
    
    // 存储用户信息
    const userStore = useUserStore();
    userStore.setUser(result.user);
    userStore.setToken(result.access_token);
    
    // 跳转
    router.push('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 2. 获取文章列表

```typescript
import { searchArticles } from '@/lib/api/article';

const fetchArticles = async () => {
  try {
    const result = await searchArticles({
      query: 'React',
      category: 'frontend',
      page: 1,
      page_size: 10
    });
    
    console.log('Articles:', result.list);
    console.log('Total:', result.total);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
  }
};
```

### 3. 上传图片

```typescript
import { uploadImage } from '@/lib/api/comment';

const handleUpload = async (file: File) => {
  try {
    const result = await uploadImage(file, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });
    
    console.log('Image URL:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 4. 创建评论

```typescript
import { createComment } from '@/lib/api/comment';

const handleComment = async () => {
  try {
    await createComment({
      article_id: 123,
      content: 'Great article!',
      parent_id: 0
    });
    
    // 刷新评论列表
  } catch (error) {
    console.error('Failed to create comment:', error);
  }
};
```

## 错误处理

### 常见错误码

- `401 Unauthorized`: Token 过期或无效，自动跳转登录页
- `403 Forbidden`: 无权限访问
- `404 Not Found`: 资源不存在
- `500 Server Error`: 服务器错误

### 错误处理示例

```typescript
try {
  const result = await someApiCall();
  // 成功处理
} catch (error) {
  if (error.response?.status === 401) {
    // 已自动跳转登录，可显示提示
    toast.error('请先登录');
  } else if (error.response?.status === 403) {
    toast.error('无权限访问');
  } else {
    toast.error(error.message || '操作失败');
  }
}
```

## 测试清单

### 启动服务

1. **启动后端**:
   ```bash
   cd server
   go run main.go
   # 或
   ./main.exe
   ```

2. **启动前端**:
   ```bash
   cd blog-nextjs
   npm run dev
   ```

### 测试步骤

- [ ] 1. 访问首页 `http://localhost:3000`
- [ ] 2. 测试文章列表加载
- [ ] 3. 测试文章详情页
- [ ] 4. 测试用户注册
- [ ] 5. 测试用户登录
- [ ] 6. 测试评论功能
- [ ] 7. 测试搜索功能
- [ ] 8. 测试管理后台（需要管理员账号）

### 调试技巧

1. **查看网络请求**:
   - 打开浏览器开发者工具 (F12)
   - 切换到 Network 标签
   - 查看 API 请求和响应

2. **查看后端日志**:
   - 后端日志文件: `server/log/go_blog.log`
   - 控制台输出

3. **检查 Token**:
   ```javascript
   // 浏览器控制台
   console.log(localStorage.getItem('access_token'));
   ```

4. **清除本地存储**:
   ```javascript
   // 浏览器控制台
   localStorage.clear();
   ```

## 常见问题

### 1. CORS 错误
确保后端已配置 CORS 中间件，允许前端域名访问。

### 2. Token 无效
- 检查 Token 是否过期
- 检查 Token 格式是否正确
- 尝试重新登录

### 3. 404 错误
- 检查 API 路径是否正确
- 确认后端服务是否正常运行
- 查看后端路由配置

### 4. 图片上传失败
- 检查文件大小（默认限制 20MB）
- 确认文件类型是否支持
- 检查 uploads 目录权限

## 注意事项

1. **开发环境**: Mock API 已禁用，所有请求都会发送到真实后端
2. **生产环境**: 需要修改 `.env.production` 中的 API 地址
3. **Token 管理**: Token 存储在 localStorage，注意安全性
4. **权限验证**: 管理员接口需要管理员权限
5. **错误处理**: 所有 API 调用都应该包含 try-catch

## 下一步

1. 根据实际业务需求调整 API 接口
2. 完善错误处理和用户提示
3. 添加 API 请求缓存优化性能
4. 实现 API 请求重试机制
5. 添加 API 请求日志记录