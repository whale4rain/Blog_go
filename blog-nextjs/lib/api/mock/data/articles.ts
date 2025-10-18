// ============================================================================
// Mock Article Data
// ============================================================================

import type { Article, CategoryStat, TagStat } from "@/types";

export const mockArticles: Article[] = [
  {
    id: 1,
    cover: "https://picsum.photos/seed/article1/800/400.jpg",
    title: "Getting Started with Next.js 14",
    category: "Technology",
    tags: ["Next.js", "React", "Web Development"],
    abstract:
      "Learn how to build modern web applications with Next.js 14 and its new features.",
    content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements that make web development even more powerful and efficient.

## Key Features

### App Router
The new App Router provides better routing capabilities and layout management.

### Server Components
Server Components allow you to build more efficient applications by reducing client-side JavaScript.

### Turbopack
Turbopack is the new bundler that provides significantly faster builds and development experience.

## Getting Started

To create a new Next.js 14 project:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## Conclusion

Next.js 14 is a powerful framework for building modern web applications with excellent performance and developer experience.`,
    author: {
      id: 1,
      uuid: "user-uuid-1",
      username: "John Doe",
      email: "john@example.com",
      avatar: "https://picsum.photos/seed/user1/100/100.jpg",
      role: "admin",
      status: 1,
      signature: "Web developer and tech enthusiast",
      address: "San Francisco, CA",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    author_id: 1,
    view_count: 1250,
    like_count: 89,
    comment_count: 15,
    status: 1,
    is_top: true,
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T10:00:00Z",
  },
  {
    id: 2,
    cover: "https://picsum.photos/seed/article2/800/400.jpg",
    title: "Understanding TypeScript Generics",
    category: "Programming",
    tags: ["TypeScript", "JavaScript", "Programming"],
    abstract:
      "Deep dive into TypeScript generics and how to use them effectively in your code.",
    content: `# Understanding TypeScript Generics

Generics are a powerful feature in TypeScript that allows you to write reusable and type-safe code.

## What are Generics?

Generics provide a way to create components that work over a variety of types rather than a single one.

## Basic Syntax

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## Common Use Cases

### Generic Functions
\`\`\`typescript
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}
\`\`\`

### Generic Interfaces
\`\`\`typescript
interface Box<T> {
  value: T;
}
\`\`\`

## Conclusion

Generics are essential for writing type-safe and reusable TypeScript code.`,
    author: {
      id: 2,
      uuid: "user-uuid-2",
      username: "Jane Smith",
      email: "jane@example.com",
      avatar: "https://picsum.photos/seed/user2/100/100.jpg",
      role: "user",
      status: 1,
      signature: "TypeScript enthusiast",
      address: "New York, NY",
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    },
    author_id: 2,
    view_count: 890,
    like_count: 67,
    comment_count: 8,
    status: 1,
    is_top: false,
    created_at: "2024-03-14T15:30:00Z",
    updated_at: "2024-03-14T15:30:00Z",
  },
  {
    id: 3,
    cover: "https://picsum.photos/seed/article3/800/400.jpg",
    title: "Modern CSS Techniques",
    category: "Design",
    tags: ["CSS", "Web Design", "Frontend"],
    abstract:
      "Explore modern CSS techniques including Grid, Flexbox, and custom properties.",
    content: `# Modern CSS Techniques

CSS has evolved significantly over the years. Let's explore modern techniques.

## CSS Grid
Grid layouts provide two-dimensional control over your layout.

## Flexbox
Flexbox offers one-dimensional layout capabilities.

## Custom Properties
CSS variables allow for dynamic styling.

## Conclusion
Modern CSS provides powerful tools for creating beautiful, responsive layouts.`,
    author: {
      id: 1,
      uuid: "user-uuid-1",
      username: "John Doe",
      email: "john@example.com",
      avatar: "https://picsum.photos/seed/user1/100/100.jpg",
      role: "admin",
      status: 1,
      signature: "Web developer and tech enthusiast",
      address: "San Francisco, CA",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    author_id: 1,
    view_count: 567,
    like_count: 45,
    comment_count: 12,
    status: 1,
    is_top: false,
    created_at: "2024-03-13T09:15:00Z",
    updated_at: "2024-03-13T09:15:00Z",
  },
];

export const mockCategoryStats: CategoryStat[] = [
  { category: "Technology", count: 15 },
  { category: "Programming", count: 23 },
  { category: "Design", count: 8 },
  { category: "Tutorial", count: 12 },
  { category: "News", count: 5 },
];

export const mockTagStats: TagStat[] = [
  { tag: "Next.js", count: 8 },
  { tag: "React", count: 12 },
  { tag: "TypeScript", count: 10 },
  { tag: "JavaScript", count: 15 },
  { tag: "CSS", count: 7 },
  { tag: "Web Development", count: 20 },
  { tag: "Frontend", count: 18 },
  { tag: "Backend", count: 6 },
];
