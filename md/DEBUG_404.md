# 调试 404 错误

## 请按照以下步骤检查：

### 1. 确认 Next.js 开发服务器正在运行

```powershell
cd D:\task\go_blog\blog-nextjs
npm run dev
```

应该看到：
```
 ✓ Ready in 2.5s
 ○ Local:   http://localhost:3000
```

### 2. 检查浏览器地址栏

确保访问的 URL 是：
```
http://localhost:3000/dashboard/articles/rc6sY5oBF29CnB3OviqZ/edit
```

**注意**：
- 路径中的 ID 必须是真实存在的文章 ID
- ID 来自 Elasticsearch，格式类似: `rc6sY5oBF29CnB3OviqZ`

### 3. 打开浏览器开发者工具

**Windows**: 按 `F12` 或 `Ctrl+Shift+I`

#### 检查 Console 选项卡
- 是否有 JavaScript 错误？
- 是否有 API 调用失败的错误？

#### 检查 Network 选项卡
- 点击清空按钮（垃圾桶图标）
- 刷新页面（F5）
- 查找失败的请求（红色）

特别关注：
1. **页面加载请求** - 应该是 200 状态码
2. **API 请求** - 类似 `http://127.0.0.1:8080/api/article/rc6sY5oBF29CnB3OviqZ`

### 4. 如果是页面 404 (Next.js 页面不存在)

#### 可能的原因：

**A. 文件夹名称错误**
- 检查文件夹是否确实是 `[id]` (包括方括号)
- 路径应该是: `app/dashboard/articles/edit/[id]/page.tsx`

**B. 缺少 layout.tsx**
- 检查是否需要在上层目录添加 `layout.tsx`

**C. Next.js 缓存问题**
```powershell
cd D:\task\go_blog\blog-nextjs
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

### 5. 如果是 API 404 (后端接口不存在)

#### 检查后端日志
在运行 `go run main.go` 的终端窗口中，应该看到类似请求日志：
```
[GIN] 2025/11/09 - 10:27:39 | 200 | 47ms | ::1 | GET "/api/article/rc6sY5oBF29CnB3OviqZ"
```

如果看到 404：
```
[GIN] 2025/11/09 - 10:27:39 | 404 | 47ms | ::1 | GET "/api/article/rc6sY5oBF29CnB3OviqZ"
```

#### 可能的原因：

**A. 文章 ID 不存在**
- 使用文章列表页面的真实 ID
- 或者通过 API 查询获取真实 ID：
  ```
  http://127.0.0.1:8080/api/article/search?page=1&page_size=10&order=desc
  ```

**B. 路由配置问题**
- 后端应该有路由: `GET /api/article/:id`
- 检查 `server/router/article.go`

### 6. 具体错误信息

请提供以下信息以便进一步诊断：

1. **浏览器 Console 的错误信息**
2. **Network 选项卡中失败请求的详细信息**
   - Request URL
   - Status Code
   - Response 内容
3. **后端终端的日志输出**

### 7. 快速测试

#### 测试后端 API 是否工作
在浏览器直接访问（替换为真实的文章 ID）：
```
http://127.0.0.1:8080/api/article/3x52uJgBbBD9qxldn-x3
```

应该返回 JSON 数据，而不是 404。

#### 测试文章列表是否能加载
访问：
```
http://localhost:3000/dashboard/articles
```

如果能看到文章列表，点击任意文章的 "Edit" 按钮。

### 8. 常见解决方案

#### 方案 1: 重启服务
```powershell
# 停止 Next.js (Ctrl+C)
# 停止 Go 后端 (Ctrl+C)

# 重新启动 Go 后端
cd D:\task\go_blog\server
go run main.go

# 新的终端窗口
# 重新启动 Next.js
cd D:\task\go_blog\blog-nextjs
npm run dev
```

#### 方案 2: 清除 Next.js 缓存
```powershell
cd D:\task\go_blog\blog-nextjs
Remove-Item -Path ".next" -Recurse -Force
Remove-Item -Path "node_modules/.cache" -Recurse -Force
npm run dev
```

#### 方案 3: 使用正确的文章 ID
从文章列表页面复制一个真实的文章 ID，例如：
```
http://localhost:3000/dashboard/articles/3x52uJgBbBD9qxldn-x3/edit
```

## 需要提供的信息

请告诉我：
1. **哪个 URL 显示 404？** 
   - Next.js 页面 URL (http://localhost:3000/...)
   - 或 API URL (http://127.0.0.1:8080/api/...)

2. **浏览器控制台有什么错误？**

3. **Network 选项卡中哪个请求失败了？**
