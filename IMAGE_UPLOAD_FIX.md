# 图片上传问题修复说明

## 问题描述

1. **404 错误**：前端尝试通过 `http://localhost:3000/uploads/...` 访问图片，但图片实际存储在后端服务器 `http://localhost:8080/uploads/...`
2. **上传失败**：Content-Type 不是 multipart/form-data

## 解决方案

### 1. 修复 multipart/form-data 问题

**文件**: `blog-nextjs/lib/api/client.ts`

在 `upload` 函数中显式设置 Content-Type 为 multipart/form-data：

```typescript
export async function upload<T = unknown>(
  url: string,
  formData: FormData,
  onProgress?: (progress: number) => void,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await client.post<ApiResponse<T>>(url, formData, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data',
    },
    // ... rest of config
  });
  return response.data.data;
}
```

### 2. 配置 Next.js 代理

**文件**: `blog-nextjs/next.config.js`

添加 `rewrites` 配置，将 `/uploads/*` 请求代理到后端服务器：

```javascript
async rewrites() {
  return [
    {
      source: '/uploads/:path*',
      destination: 'http://localhost:8080/uploads/:path*',
    },
  ];
},
```

这样，前端请求 `http://localhost:3000/uploads/image/xxx.jpg` 会自动转发到 `http://localhost:8080/uploads/image/xxx.jpg`

### 3. 添加图片 URL 处理工具函数

**文件**: `blog-nextjs/lib/utils/index.ts`

添加 `getImageUrl` 函数来处理图片 URL：

```typescript
export function getImageUrl(url: string): string {
  if (!url) return '';
  
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是 /uploads 开头的相对路径，直接返回（Next.js 会代理）
  if (url.startsWith('/uploads')) {
    return url;
  }
  
  return url;
}
```

### 4. 更新图片管理页面

**文件**: `blog-nextjs/app/dashboard/images/page.tsx`

在获取图片列表时使用 `getImageUrl` 处理图片 URL：

```typescript
import { getImageUrl } from "@/lib/utils";

// 在 fetchImages 函数中
const formattedImages: ImageFile[] = response.list.map((img: any) => ({
  id: img.id,
  name: img.name,
  url: getImageUrl(img.url), // 处理图片 URL
  // ... rest of properties
}));
```

### 5. 修复后端字段名不匹配

**文件**: `blog-nextjs/lib/api/comment.ts`

将上传时的字段名从 `"file"` 改为 `"image"`（匹配后端 API 要求）：

```typescript
export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("image", file); // 后端接收的字段名是 "image"
  
  return upload<UploadImageResponse>("/image/upload", formData, onProgress);
}
```

## 需要重启的服务

修改了 `next.config.js` 文件后，**必须重启 Next.js 开发服务器**才能使代理配置生效：

```powershell
# 停止当前运行的开发服务器（Ctrl+C）
# 然后重新启动
cd blog-nextjs
npm run dev
```

## 验证步骤

1. 确保后端服务器运行在 `http://localhost:8080`
2. 确保前端开发服务器运行在 `http://localhost:3000`
3. 访问 `http://localhost:3000/dashboard/images`
4. 尝试上传图片
5. 验证图片能够正常显示

## 技术细节

### 为什么需要 Next.js 代理？

1. **避免 CORS 问题**：前端和后端运行在不同端口，直接请求会遇到跨域问题
2. **统一域名**：通过代理，所有请求都通过 `localhost:3000`，简化了部署和配置
3. **开发便利**：无需配置额外的反向代理服务器（如 Nginx）

### Content-Type 为什么重要？

- `multipart/form-data` 是上传文件的标准格式
- Axios 需要显式设置这个 header 才能正确上传 FormData
- 浏览器会自动添加 `boundary` 参数到 Content-Type 中

## 常见问题

### Q: 图片还是 404？

A: 确保：
1. Next.js 开发服务器已经重启
2. 后端服务器正在运行
3. 图片文件确实存在于 `server/uploads` 目录

### Q: 上传还是失败？

A: 检查：
1. 后端 API 路由是否正确（`/api/image/upload`）
2. 后端是否正确配置了文件上传目录
3. 文件大小是否超过限制
4. 浏览器控制台的详细错误信息

### Q: CDN 图片怎么处理？

A: `getImageUrl` 函数会检测 URL 是否以 `http://` 或 `https://` 开头，如果是则直接返回，不做任何处理。这意味着七牛云等 CDN 的图片会正常工作。
