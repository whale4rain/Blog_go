# JWT快速参考指南

## 🎯 核心概念

### 双Token机制

```
Access Token (访问令牌)
├─ 存储位置: localStorage
├─ 有效期: 15分钟
├─ 用途: 访问受保护的API
└─ 传输: x-access-token header

Refresh Token (刷新令牌)
├─ 存储位置: HTTP-only Cookie
├─ 有效期: 30天
├─ 用途: 刷新Access Token
└─ 传输: 自动通过Cookie
```

### 安全设计

✅ **Access Token** → localStorage (短期，可被JS访问)
✅ **Refresh Token** → HTTP-only Cookie (长期，JS无法访问，防XSS)

## 🚀 快速开始

### 1. 登录

```typescript
import { useUserStore } from "@/lib/store/userStore";
import { login } from "@/lib/api/user";

const { login: setUserLogin } = useUserStore();

const userInfo = await login({
  email: "user@example.com",
  password: "password",
  captcha: "1234",
  captcha_id: "captcha-id",
});

setUserLogin(userInfo);
// ✅ Access Token自动存储到localStorage
// ✅ Refresh Token自动设置到Cookie (后端设置)
```

### 2. 检查认证状态

```typescript
import { useAuth } from "@/lib/store/userStore";

const { isAuthenticated, isInitialized, user } = useAuth();

if (!isInitialized) return <Loading />;
if (!isAuthenticated) return <LoginRequired />;

return <Dashboard user={user} />;
```

### 3. 调用API

```typescript
import { get, post } from "@/lib/api/client";

// ✅ 自动携带Access Token
// ✅ 自动刷新过期Token
// ✅ 自动重试失败请求
const articles = await get("/article/list");
const result = await post("/article/create", data);
```

### 4. 上传文件

```typescript
import { upload } from "@/lib/api/client";

const formData = new FormData();
formData.append("image", file);

const result = await upload(
  "/upload/image",
  formData,
  (progress) => console.log(`${progress}%`)
);
// ✅ 特殊处理，确保Cookie不被清除
```

### 5. 登出

```typescript
import { logout } from "@/lib/api/user";

await logout();
// ✅ 自动清除localStorage
// ✅ 自动清除后端Cookie
// ✅ 自动更新状态
```

## 📚 常用Hooks

### useAuth()

```typescript
const {
  isAuthenticated,    // 完整认证检查
  isInitialized,      // 状态是否初始化
  user,               // 用户信息
  token,              // Access Token
  isLoggedIn,         // 是否登录
  isAdmin,            // 是否管理员
  canAccessDashboard, // 是否可访问Dashboard
} = useAuth();
```

### useCurrentUser()

```typescript
const { user, isLoggedIn } = useCurrentUser();
```

### useAdminAuth()

```typescript
const { isAdmin, isAuthenticated } = useAdminAuth();
```

## 🔧 常用函数

### Token操作

```typescript
// 获取Access Token
import { getAccessToken } from "@/lib/api/client";
const token = getAccessToken();

// 获取Refresh Token (从Cookie)
import { getRefreshTokenFromCookie } from "@/lib/store/userStore";
const refreshToken = getRefreshTokenFromCookie();

// 检查是否有Refresh Token
import { hasRefreshToken } from "@/lib/store/userStore";
const hasToken = hasRefreshToken();

// 检查认证状态
import { isAuthenticated } from "@/lib/api/client";
const authenticated = isAuthenticated();

// 清除认证数据
import { clearAuth } from "@/lib/api/client";
clearAuth();
```

### 用户Store操作

```typescript
import { useUserStore } from "@/lib/store/userStore";

const store = useUserStore();

// 登录
store.login(userInfo);

// 登出
store.logout();

// 更新用户信息
store.updateUser({ username: "newname" });

// 设置Token
store.setToken("new-access-token");

// 清除Token
store.clearToken();

// 初始化
store.initialize();

// 验证
store.validateAuth();
```

## ⚠️ 重要注意事项

### ❌ 不要这样做

```typescript
// ❌ 不要手动存储refresh_token到localStorage
localStorage.setItem("refresh_token", token);

// ❌ 不要从localStorage读取refresh_token
const token = localStorage.getItem("refresh_token");

// ❌ 不要在组件中直接使用useUserStore
const { user } = useUserStore();

// ❌ 不要手动操作Cookie
document.cookie = "x-refresh-token=...";

// ❌ 不要直接用post上传文件
await post("/upload", formData);
```

### ✅ 应该这样做

```typescript
// ✅ 使用useAuth Hook
const { user } = useAuth();

// ✅ 从Cookie读取refresh_token
import { getRefreshTokenFromCookie } from "@/lib/store/userStore";
const token = getRefreshTokenFromCookie();

// ✅ 使用upload函数上传文件
import { upload } from "@/lib/api/client";
await upload("/upload", formData);

// ✅ 让后端管理Cookie
// 登录和刷新时，后端自动设置Cookie
```

## 🔍 故障排查

### Token刷新失败

```typescript
// 检查Cookie是否存在
import { hasRefreshToken } from "@/lib/store/userStore";
console.log("Has refresh token:", hasRefreshToken());

// 检查Cookie值
import { getRefreshTokenFromCookie } from "@/lib/store/userStore";
console.log("Refresh token:", getRefreshTokenFromCookie());

// 检查localStorage
console.log("Access token:", localStorage.getItem("access_token"));

// 检查浏览器Cookie (开发者工具 → Application → Cookies)
// 应该看到: x-refresh-token
```

### 登录后立即退出

```typescript
// 1. 检查初始化状态
const { isInitialized } = useAuth();
console.log("Initialized:", isInitialized);

// 2. 检查Cookie是否被正确设置
// 查看Network面板 → 登录请求 → Response Headers
// 应该有: Set-Cookie: x-refresh-token=...

// 3. 检查CORS配置
// 确保withCredentials: true
// 确保后端AllowCredentials: true
```

### Upload后Cookie丢失

```typescript
// ✅ 确保使用upload函数
import { upload } from "@/lib/api/client";

// ✅ 不要手动设置Content-Type
// upload函数会自动处理

// ✅ 检查withCredentials
// upload函数已自动设置为true
```

### 401错误持续出现

```typescript
// 1. 清除所有缓存
localStorage.clear();
// 手动删除所有Cookie (开发者工具)

// 2. 重新登录
await login(...);

// 3. 检查Token刷新逻辑
// 查看Network面板，401后应该调用/user/refreshToken
```

## 🧪 测试验证

### 访问测试页面

```
http://localhost:3000/test-jwt
```

### 手动测试步骤

1. **登录测试**
   - 访问 `/login`
   - 登录成功后检查Cookie (DevTools → Application → Cookies)
   - 应该看到 `x-refresh-token`

2. **Token刷新测试**
   - 等待15分钟让Access Token过期
   - 或手动删除localStorage中的access_token
   - 访问需要认证的页面
   - 应该自动刷新Token

3. **Upload测试**
   - 上传图片
   - 检查Cookie是否仍然存在
   - 上传后检查是否仍保持登录状态

4. **登出测试**
   - 点击登出
   - 检查Cookie已被清除
   - 检查localStorage已被清除

## 📊 状态流程图

```
用户访问
   ↓
初始化Store (读取localStorage + 检查Cookie)
   ↓
┌──────────────────┐
│ 有Token?         │
└──────────────────┘
   ↓YES        ↓NO
验证Token     显示登录
   ↓
Token有效?
   ↓YES        ↓NO
进入应用     刷新Token
               ↓
           刷新成功?
           ↓YES    ↓NO
         进入应用  重新登录
```

## 🎓 最佳实践

1. **始终使用useAuth Hook** - 不要直接使用useUserStore
2. **检查isInitialized** - 避免闪烁问题
3. **使用upload函数上传** - 不要用post
4. **不要手动操作Refresh Token** - 让系统自动处理
5. **启用withCredentials** - 已在client.ts中配置
6. **处理401错误** - 由interceptors自动处理
7. **清理时调用logout** - 确保Cookie被清除

## 🔗 相关文件

- `lib/store/userStore.ts` - 用户状态管理
- `lib/api/client.ts` - API客户端配置
- `lib/api/user.ts` - 用户API
- `types/index.ts` - 类型定义
- `app/test-jwt/page.tsx` - 测试页面

## 📞 获取帮助

1. 查看 `JWT_SECURITY_FIX.md` 了解详细实现
2. 访问 `/test-jwt` 页面进行调试
3. 检查浏览器控制台错误信息
4. 查看Network面板的请求详情

---

**记住**: Refresh Token在Cookie中，Access Token在localStorage中！🔐