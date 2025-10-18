# Migration Guide: Vue → Next.js (React)

## 📚 Overview

This guide explains the migration from the original Vue 3 blog application to the new Next.js + React implementation. It covers architectural changes, component mappings, and how to run both versions.

---

## 🏗️ Architecture Comparison

### Original Vue 3 Stack
- **Framework**: Vue 3 with Composition API
- **Routing**: Vue Router (client-side)
- **State Management**: Pinia
- **UI Library**: Element Plus
- **Build Tool**: Vite
- **Styling**: SCSS + Element Plus theming

### New Next.js Stack
- **Framework**: Next.js 14 + React 18
- **Routing**: Next.js App Router (file-based, with SSR)
- **State Management**: Zustand
- **UI Library**: Custom components with Tailwind CSS
- **Build Tool**: Next.js (Webpack/Turbopack)
- **Styling**: Tailwind CSS with Google-inspired design

---

## 🔄 Key Differences

### 1. Component Syntax

**Vue 3 (Composition API)**
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

const increment = () => {
  count.value++
}

onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

**React (Hooks)**
```tsx
'use client'

import { useState, useEffect, useMemo } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  const double = useMemo(() => count * 2, [count])

  const increment = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    console.log('Component mounted')
  }, [])

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

### 2. Routing

**Vue Router**
```typescript
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/article/:id',
    component: () => import('@/views/Article.vue')
  }
]
```

**Next.js App Router (File-based)**
```
app/
  page.tsx              → /
  article/
    [id]/
      page.tsx          → /article/:id
```

### 3. State Management

**Pinia (Vue)**
```typescript
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  actions: {
    login(user) {
      this.user = user
      this.isLoggedIn = true
    }
  }
})
```

**Zustand (React)**
```typescript
import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true })
}))
```

### 4. Data Fetching

**Vue 3**
```typescript
// Component
const articles = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  articles.value = await getArticles()
  loading.value = false
})
```

**Next.js (Server Component)**
```typescript
// Server Component (default in App Router)
export default async function Page() {
  const articles = await getArticles() // Fetched on server
  
  return <ArticleList articles={articles} />
}
```

**Next.js (Client Component)**
```typescript
'use client'

export default function Page() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await getArticles()
      setArticles(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return <ArticleList articles={articles} loading={loading} />
}
```

---

## 📦 Component Mapping

### Layout Components

| Vue Component | Next.js Component | Location |
|--------------|-------------------|----------|
| `WebNavbar.vue` | `Header.tsx` | `components/layout/Header.tsx` |
| `WebFooter.vue` | `Footer.tsx` | `components/layout/Footer.tsx` |
| `DashboardMenu.vue` | `Sidebar.tsx` | `components/layout/Sidebar.tsx` |

### UI Components

| Vue (Element Plus) | Next.js (Custom) | Notes |
|-------------------|------------------|-------|
| `<el-button>` | `<Button>` | Google-style design |
| `<el-input>` | `<Input>` | Custom validation |
| `<el-card>` | `<Card>` | Minimalist style |
| `<el-dialog>` | `<Modal>` | Accessible dialog |
| `<el-table>` | `<Table>` | Responsive table |

### Page Components

| Vue Page | Next.js Page | Route |
|----------|-------------|-------|
| `views/web/index/index.vue` | `app/page.tsx` | `/` |
| `views/web/article/index.vue` | `app/article/[id]/page.tsx` | `/article/:id` |
| `views/web/search/index.vue` | `app/search/page.tsx` | `/search` |
| `views/web/about/index.vue` | `app/about/page.tsx` | `/about` |
| `views/login/index.vue` | `app/login/page.tsx` | `/login` |
| `views/dashboard/home/index.vue` | `app/dashboard/page.tsx` | `/dashboard` |

---

## 🎨 Styling Migration

### From Element Plus to Tailwind CSS

**Vue (Element Plus)**
```vue
<el-button type="primary" size="large">
  Click Me
</el-button>
```

**Next.js (Tailwind CSS)**
```tsx
<button className="px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors">
  Click Me
</button>
```

### Theme Variables

**SCSS Variables (Vue)**
```scss
$primary-color: #409eff;
$text-color: #303133;
$border-color: #dcdfe6;
```

**Tailwind Config (Next.js)**
```typescript
theme: {
  extend: {
    colors: {
      'google-blue': 'hsl(214, 90%, 52%)',
      'foreground': 'hsl(215, 25%, 27%)',
      'border': 'hsl(210, 40%, 87%)',
    }
  }
}
```

---

## 🚀 Running Both Versions

### Vue Version (Original)

```bash
# Navigate to Vue project
cd go_blog/web

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:80
```

### Next.js Version (New)

```bash
# Navigate to Next.js project
cd go_blog/blog-nextjs

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

### Backend (Required for both)

```bash
# Navigate to backend
cd go_blog/server

# Run Go server
go run main.go

# API available at http://localhost:8080
```

---

## 🔧 API Integration

Both versions use the same backend API. The axios client configuration is similar:

**Vue**
```typescript
// src/utils/request.ts
const service = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000
})
```

**Next.js**
```typescript
// lib/api/client.ts
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000
})
```

---

## 📝 Key Migration Steps

### 1. Component Migration Checklist

- [ ] Replace `<template>` with JSX return statement
- [ ] Convert `ref()` to `useState()`
- [ ] Convert `computed()` to `useMemo()` or `useCallback()`
- [ ] Replace `onMounted()` with `useEffect(() => {}, [])`
- [ ] Convert `watch()` to `useEffect(() => {}, [dependency])`
- [ ] Update event handlers: `@click` → `onClick`
- [ ] Update v-model: `v-model="value"` → `value={value} onChange={setValue}`
- [ ] Replace Vue Router with Next.js Link and useRouter

### 2. State Management Migration

**From Pinia to Zustand:**

1. Create equivalent Zustand store
2. Replace `useStore()` imports
3. Update state access patterns
4. Test all state mutations

### 3. Styling Migration

**From Element Plus to Tailwind:**

1. Identify Element Plus components
2. Create custom components with Tailwind
3. Apply Google-inspired design tokens
4. Ensure responsive behavior
5. Add accessibility features

### 4. Routing Migration

**From Vue Router to Next.js:**

1. Map routes to file structure
2. Update navigation components
3. Implement dynamic routes with [id]
4. Add route guards with middleware
5. Configure redirects in next.config.js

---

## ⚡ Performance Improvements

### Next.js Advantages

1. **Server-Side Rendering (SSR)**: Faster initial page load
2. **Automatic Code Splitting**: Smaller bundle sizes
3. **Image Optimization**: Built-in next/image component
4. **Static Generation**: Pre-render pages at build time
5. **API Routes**: Backend logic in the same project

### Optimization Techniques

```typescript
// Image optimization
import Image from 'next/image'

<Image
  src="/article-cover.jpg"
  alt="Article"
  width={800}
  height={600}
  priority={true}
/>

// Dynamic imports
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

---

## 🐛 Common Migration Issues

### Issue 1: localStorage in Server Components

**Problem**: Cannot access localStorage on server

**Solution**: Use Client Components with 'use client' directive

```typescript
'use client'

export default function Component() {
  useEffect(() => {
    const token = localStorage.getItem('token')
  }, [])
}
```

### Issue 2: Window Object Undefined

**Problem**: window is undefined during SSR

**Solution**: Check if window exists

```typescript
if (typeof window !== 'undefined') {
  // Browser-only code
  window.scrollTo(0, 0)
}
```

### Issue 3: Hydration Mismatch

**Problem**: Server and client render different content

**Solution**: Ensure consistent rendering

```typescript
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null
```

---

## 📊 Feature Parity

### Implemented Features ✅

- [x] Home page with article list
- [x] Article detail page
- [x] Search and archive functionality
- [x] About page
- [x] User authentication (login/register)
- [x] Dashboard home
- [x] Article management (CRUD)
- [x] User profile management
- [x] Comment system
- [x] Category and tag filtering
- [x] Responsive design
- [x] Google-inspired UI

### Simplified Features ⚠️

- [~] News page (can be added later)
- [~] Friend links (simplified)
- [~] Advertisements (optional)
- [~] Advanced system configuration

### Next.js Enhancements 🚀

- [x] Server-side rendering
- [x] Static site generation
- [x] Image optimization
- [x] Better SEO
- [x] Faster page loads
- [x] Enhanced security headers

---

## 🎯 Best Practices

### React/Next.js

1. Use Server Components by default
2. Add 'use client' only when needed
3. Leverage Next.js Image for all images
4. Use dynamic imports for heavy components
5. Implement proper error boundaries
6. Add loading states with Suspense

### TypeScript

1. Define interfaces for all props
2. Use type inference where possible
3. Avoid 'any' type
4. Create reusable types in types/index.ts
5. Use generics for flexible components

### Performance

1. Memoize expensive computations
2. Use React.memo for pure components
3. Implement virtual scrolling for long lists
4. Lazy load images below the fold
5. Minimize bundle size with tree shaking

---

## 📚 Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [App Router Guide](https://nextjs.org/docs/app)

### React
- [React Documentation](https://react.dev)
- [React Hooks Reference](https://react.dev/reference/react)
- [React Best Practices](https://react.dev/learn)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com)
- [Google Material Design](https://material.io/design)

---

## 🤝 Contributing

When contributing to the Next.js version:

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Write semantic, accessible HTML
4. Add comments for complex logic
5. Test on mobile and desktop
6. Run type checking before committing

---

## 📞 Support

If you encounter issues during migration:

1. Check this guide first
2. Review the README.md
3. Check existing GitHub issues
4. Create a detailed issue report

---

**Happy Migrating! 🎉**