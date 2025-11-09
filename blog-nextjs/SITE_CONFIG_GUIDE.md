# 网站配置指南

## 配置文件位置
`lib/constants/siteConfig.ts`

## 如何修改网站图标

### 方法 1：使用文字 Logo（默认）
当前配置使用文字 "W4" 作为 Logo，带蓝白渐变效果：

```typescript
logo: {
  text: "W4",
  gradient: {
    from: "google-blue",
    to: "white",
  },
}
```

### 方法 2：使用图片 Logo
1. 将你的 Logo 图片放到 `public` 文件夹中，例如 `public/logo.png`
2. 修改配置文件：

```typescript
logo: {
  text: "W4", // 保留作为备用
  gradient: {
    from: "google-blue",
    to: "white",
  },
  imageUrl: "/logo.png", // 添加这一行，指向你的图片
}
```

### 支持的图片格式
- PNG (推荐，支持透明背景)
- JPG
- SVG
- WebP

### 图片尺寸建议
- 小 Logo (Header): 32x32px 或 64x64px
- 中 Logo (Footer): 40x40px 或 80x80px
- 大 Logo (Login): 64x64px 或 128x128px

图片会自动适配不同场景的尺寸。

## 如何修改社交链接

在 `siteConfig.ts` 中修改 `social` 部分：

```typescript
social: {
  github: "https://github.com/whale4rain",     // GitHub 链接
  twitter: "https://twitter.com/yourhandle",   // Twitter 链接
  linkedin: "https://linkedin.com/in/yourprofile", // LinkedIn 链接
  email: "contact@whale4blog.com",             // 联系邮箱
}
```

### 隐藏某个社交链接
如果不想显示某个社交链接，可以删除该行或注释掉：

```typescript
social: {
  github: "https://github.com/whale4rain",
  // twitter: "https://twitter.com",  // 注释掉则不显示
  linkedin: undefined,  // 或设置为 undefined
  email: "contact@whale4blog.com",
}
```

## 如何修改网站名称

```typescript
name: "whale4blog",        // 完整名称
shortName: "W4",          // 缩写（用于小屏幕）
description: "A modern blog platform...", // 网站描述
```

## Logo 使用场景

配置文件会在以下位置自动应用：

1. **Header** - 导航栏左上角
2. **Footer** - 页脚品牌区域
3. **Login Page** - 登录/注册页面
4. **About Page** - 关于页面（如需要）

## 示例配置

### 完整配置示例（使用图片）

```typescript
export const siteConfig: SiteConfig = {
  name: "whale4blog",
  shortName: "W4",
  description: "A modern blog platform built with Next.js",
  logo: {
    text: "W4",
    gradient: {
      from: "google-blue",
      to: "white",
    },
    imageUrl: "/logo.png", // 使用图片
  },
  social: {
    github: "https://github.com/whale4rain",
    twitter: "https://twitter.com/whale4blog",
    linkedin: "https://linkedin.com/company/whale4blog",
    email: "hello@whale4blog.com",
  },
  links: {
    home: "/",
    about: "/about",
    search: "/search",
    dashboard: "/dashboard",
  },
};
```

### 最小配置示例（只使用文字）

```typescript
export const siteConfig: SiteConfig = {
  name: "whale4blog",
  shortName: "W4",
  description: "A modern blog platform",
  logo: {
    text: "W4",
    gradient: {
      from: "google-blue",
      to: "white",
    },
  },
  social: {
    email: "contact@whale4blog.com",
  },
  links: {
    home: "/",
    about: "/about",
    search: "/search",
    dashboard: "/dashboard",
  },
};
```

## 注意事项

1. **修改配置后需要重启开发服务器**才能看到效果
2. **图片路径**必须相对于 `public` 文件夹
3. **社交链接**确保使用完整的 URL（包括 `https://`）
4. **渐变色**默认使用 `google-blue` 到 `white`，这是 Tailwind 配置中的颜色类
