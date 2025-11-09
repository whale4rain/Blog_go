# 文章编辑功能实现说明

## 概述

已成功实现文章编辑页面 (`/dashboard/articles/[id]/edit`) 的完整功能，包括：
- ✅ 从后端获取文章详情
- ✅ 更新文章内容
- ✅ 真实的图片上传功能
- ✅ Markdown 预览
- ✅ 标签和分类管理

## 实现的功能

### 1. 后端 API 集成

#### 获取文章详情 (`getArticleById`)

**文件**: `blog-nextjs/lib/api/article.ts`

```typescript
export async function getArticleById(id: string): Promise<Article> {
  // 后端返回的是 Elasticsearch Article 结构，需要转换
  const response = await get<ArticleSource>(`/article/${id}`);
  
  // 转换为前端期望的 Article 格式
  return {
    id: id,
    cover: response.cover,
    title: response.title,
    category: response.category,
    tags: response.tags,
    abstract: response.abstract,
    content: response.content || '',
    author: {} as User,
    author_id: 0,
    view_count: response.views,
    like_count: response.likes,
    comment_count: response.comments,
    status: 1,
    is_top: false,
    created_at: response.created_at,
    updated_at: response.updated_at || response.created_at,
  };
}
```

**后端路由**: `GET /api/article/:id`

#### 更新文章 (`updateArticle`)

**文件**: `blog-nextjs/lib/api/article.ts`

```typescript
export async function updateArticle(
  id: string,
  data: UpdateArticleRequest,
): Promise<Article> {
  return put<Article>("/article/update", { ...data, id });
}
```

**后端路由**: `PUT /api/article/update`

**请求体**:
```json
{
  "id": "文章ID",
  "cover": "封面图片URL",
  "title": "文章标题",
  "category": "文章分类",
  "tags": ["标签1", "标签2"],
  "abstract": "文章摘要",
  "content": "文章内容（Markdown格式）"
}
```

### 2. 图片上传功能

#### 编辑页面 (`app/dashboard/articles/edit/[id]/page.tsx`)

**功能特性**:
- 支持点击上传
- 文件类型验证（仅图片）
- 文件大小限制（最大 10MB）
- 上传进度显示
- 错误处理和用户提示

**实现代码**:
```typescript
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // 验证文件大小（最大 10MB）
  if (file.size > 10 * 1024 * 1024) {
    alert('Image size should be less than 10MB');
    return;
  }

  try {
    setUploadingImage(true);
    const response = await uploadImage(file);
    
    if (response && response.url) {
      setFormData((prev) => ({ ...prev, cover: response.url }));
    }
  } catch (error) {
    console.error('Failed to upload image:', error);
    alert('Failed to upload image. Please try again.');
  } finally {
    setUploadingImage(false);
  }
};
```

#### 创建页面 (`app/dashboard/articles/create/page.tsx`)

同样实现了真实的图片上传功能，替换了之前的 mock 实现。

### 3. 数据转换

#### Elasticsearch 到前端格式

后端返回的数据结构：
```typescript
interface ArticleSource {
  created_at: string;
  updated_at?: string;
  cover: string;
  title: string;
  keyword?: string;
  category: string;
  tags: string[];
  abstract: string;
  content?: string;
  views: number;
  comments: number;
  likes: number;
}
```

前端期望的数据结构：
```typescript
interface Article {
  id: string;
  cover: string;
  title: string;
  category: string;
  tags: string[];
  abstract: string;
  content: string;
  author: User;
  author_id: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  status: number;
  is_top: boolean;
  created_at: string;
  updated_at: string;
}
```

转换逻辑在 `getArticleById` 函数中实现。

## 使用方法

### 访问编辑页面

1. 登录管理员账号
2. 访问文章列表：`http://localhost:3000/dashboard/articles`
3. 点击任意文章的"Edit"按钮
4. 或直接访问：`http://localhost:3000/dashboard/articles/[文章ID]/edit`

### 编辑文章

1. **修改标题**: 在顶部标题输入框中修改
2. **更新封面**: 
   - 点击封面图片区域上传新图片
   - 或点击右上角 X 删除现有封面
3. **编辑内容**: 
   - 在内容编辑器中使用 Markdown 语法
   - 点击"Preview"按钮预览渲染效果
4. **修改分类**: 从下拉列表中选择分类
5. **管理标签**: 
   - 输入标签名称并按 Enter 或点击 + 添加
   - 点击标签上的 X 删除标签
   - 最多支持 5 个标签
6. **保存更改**: 点击右上角"Save Changes"按钮

### 创建文章

访问 `http://localhost:3000/dashboard/articles/create`，流程与编辑类似。

## 技术要点

### 1. 路由参数

使用 Next.js 13+ App Router 的动态路由：
```
app/dashboard/articles/edit/[id]/page.tsx
```

通过 `useParams()` 获取文章 ID：
```typescript
const params = useParams();
const articleId = params.id as string;
```

### 2. 状态管理

使用 React Hooks 管理组件状态：
- `useState` 管理表单数据、加载状态
- `useEffect` 在组件挂载时获取文章数据
- `useRef` 管理文件上传 input 引用

### 3. 用户认证

使用 Zustand store 管理用户登录状态：
```typescript
const { user, isLoggedIn, hasHydrated } = useUserStore();
```

在加载完成前检查登录状态，未登录则跳转到登录页。

### 4. 错误处理

- API 调用失败时显示错误消息
- 文章不存在时显示友好提示
- 表单验证失败时阻止提交

## 后端要求

### 1. API 端点

确保以下 API 端点正常工作：

- `GET /api/article/:id` - 获取文章详情
- `PUT /api/article/update` - 更新文章
- `POST /api/image/upload` - 上传图片

### 2. 认证

所有管理员 API 需要：
- JWT token 认证（通过 `x-access-token` header）
- 管理员权限验证

### 3. 数据格式

#### 更新文章请求

```json
{
  "id": "rc6sY5oBF29CnB3OviqZ",
  "cover": "/uploads/image/xxx.jpg",
  "title": "文章标题",
  "category": "technology",
  "tags": ["Go", "Next.js"],
  "abstract": "文章摘要",
  "content": "# 文章内容\n\n..."
}
```

#### 图片上传响应

```json
{
  "code": 0,
  "data": {
    "url": "/uploads/image/xxx.jpg",
    "oss_type": "local"
  },
  "msg": "Successfully uploaded image"
}
```

## 测试清单

- [x] 访问编辑页面能正常加载文章数据
- [x] 修改标题、内容、摘要等字段
- [x] 上传封面图片
- [x] 添加和删除标签
- [x] 切换分类
- [x] Markdown 预览功能
- [x] 保存更改后跳转回文章列表
- [x] 图片上传显示进度
- [x] 错误提示显示正常
- [x] 未登录用户无法访问

## 常见问题

### Q: 文章加载失败？

**A**: 检查：
1. 后端服务器是否运行（`http://localhost:8080`）
2. 文章 ID 是否正确
3. 浏览器控制台是否有错误信息
4. 用户是否已登录且有权限

### Q: 图片上传失败？

**A**: 检查：
1. 图片文件是否小于 10MB
2. 图片格式是否支持（JPG, PNG, GIF, WebP）
3. 后端 `/api/image/upload` 端点是否正常
4. 检查浏览器控制台的错误信息

### Q: 保存失败？

**A**: 检查：
1. 必填字段是否已填写（标题、内容）
2. 后端 `/api/article/update` 端点是否正常
3. JWT token 是否有效
4. 用户是否有管理员权限

### Q: 图片无法显示？

**A**: 检查：
1. Next.js 开发服务器是否重启（修改 `next.config.js` 后需要重启）
2. 图片路径是否正确
3. Next.js 代理配置是否正确（`/uploads` 路径）
4. 后端静态文件服务是否正常

## 相关文件

### 前端
- `blog-nextjs/app/dashboard/articles/edit/[id]/page.tsx` - 编辑页面组件
- `blog-nextjs/app/dashboard/articles/create/page.tsx` - 创建页面组件
- `blog-nextjs/lib/api/article.ts` - 文章 API 函数
- `blog-nextjs/lib/api/comment.ts` - 图片上传 API 函数
- `blog-nextjs/types/index.ts` - TypeScript 类型定义

### 后端
- `server/api/article.go` - 文章 API 处理器
- `server/api/image.go` - 图片上传处理器
- `server/service/article.go` - 文章业务逻辑
- `server/model/request/article.go` - 请求数据结构
- `server/model/elasticsearch/article.go` - ES 数据结构

## 下一步优化

1. **富文本编辑器**: 集成更强大的 Markdown 编辑器（如 toast-ui-editor）
2. **自动保存**: 实现草稿自动保存功能
3. **版本控制**: 保存文章修改历史
4. **预览模式**: 在新标签页预览文章效果
5. **拖拽上传**: 支持图片拖拽上传
6. **批量操作**: 支持批量编辑文章属性
7. **SEO 优化**: 添加 meta 标签、关键词等 SEO 字段
8. **定时发布**: 支持设置文章发布时间
