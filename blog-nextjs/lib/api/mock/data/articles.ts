// ============================================================================
// Mock Article Data
// ============================================================================

import type { Article, CategoryStat, TagStat } from "@/types";

export const mockArticles: Article[] = [
  {
    id: "1",
    cover: "https://picsum.photos/seed/article1/800/400.jpg",
    title: "Getting Started with Next.js 14",
    category: "Technology",
    tags: ["Next.js", "React", "Web Development"],
    abstract:
      "Learn how to build modern web applications with Next.js 14 and its new features.",
    content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements that make web development even more powerful and efficient.

## Architecture Overview

Let's visualize the Next.js 14 architecture:

\`\`\`mermaid
graph TB
    A[User Request] --> B[Next.js App Router]
    B --> C{Server Component?}
    C -->|Yes| D[Server Component]
    C -->|No| E[Client Component]
    D --> F[Database/API Call]
    E --> G[Client-side Rendering]
    F --> H[HTML Response]
    G --> H

    I[Turbopack] --> J[Fast Bundling]
    K[Middleware] --> L[Request Processing]
\`\`\`

## Mathematical Foundations

The performance improvements can be expressed using mathematical formulas. For example, the bundle size reduction follows:

$$S_{new} = S_{old} \times (1 - r)$$

Where:
- $S_{new}$ is the new bundle size
- $S_{old}$ is the old bundle size
- $r$ is the reduction rate (typically $r = 0.3$ for 30% reduction)

The loading time improvement can be modeled as:

$$T_{load} = \frac{S_{bundle}}{BW} + T_{network} + T_{processing}$$

## Key Features

### App Router
The new App Router provides better routing capabilities and layout management.

### Server Components
Server Components allow you to build more efficient applications by reducing client-side JavaScript. The performance gain can be calculated as:

$$P_{gain} = \frac{T_{traditional} - T_{server}}{T_{traditional}} \times 100\%$$

### Turbopack
Turbopack is the new bundler that provides significantly faster builds and development experience.

## Development Workflow

Here's the typical development workflow with Next.js 14:

\`\`\`mermaid
flowchart LR
    A[Development] --> B[Hot Reload]
    B --> C[Turbopack Build]
    C --> D[Fast Refresh]
    D --> A

    E[Production Build] --> F[Static Generation]
    F --> G[Server Rendering]
    G --> H[CDN Deployment]
\`\`\`

## Getting Started

To create a new Next.js 14 project:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## Performance Metrics

The performance improvements follow the compound interest formula:

$$P_{final} = P_{initial} \times (1 + r)^t$$

Where:
- $P_{final}$ is the final performance
- $P_{initial}$ is the initial performance
- $r$ is the improvement rate per iteration
- $t$ is the number of iterations

## Conclusion

Next.js 14 is a powerful framework for building modern web applications with excellent performance and developer experience. The combination of mathematical optimization and modern architecture makes it an excellent choice for production applications.`,
    author: {
      id: 4,
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
    id: "2",
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

## Type System Visualization

The TypeScript type system can be visualized as follows:

\`\`\`mermaid
graph TD
    A[Type Script] --> B[Static Type Checking]
    B --> C{Generic Types}
    C --> D[Type Parameters]
    C --> E[Constraints]
    C --> F[Variance]

    D --> G[T]
    E --> H[extends Type]
    F --> I[Invariant/Covariant/Contravariant]

    J[Runtime] --> K[JavaScript]
    K --> L[No Type Information]
\`\`\`

## Mathematical Foundation

Generic type constraints can be expressed using set theory:

$$T: U \implies T \subseteq U$$

Where $T$ is the generic type and $U$ is the constraint type.

The type inference algorithm can be represented as:

$$\text{infer}(T) = \begin{cases}
\text{concrete} & \text{if } T \text{ can be determined} \\
\text{any} & \text{otherwise}
\end{cases}$$

## Advanced Generic Patterns

### Generic Constraints

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
\`\`\`

### Conditional Types

The conditional type logic follows boolean algebra:

$$T \text{ extends } U ? X : Y$$

This can be visualized as:

\`\`\`mermaid
flowchart TD
    A[Type T] --> B{Extends U?}
    B -->|Yes| C[Type X]
    B -->|No| D[Type Y]

    E[Example: string extends string] --> F[string]
    G[Example: number extends string] --> H[never]
\`\`\`

## Performance Considerations

The computational complexity of type checking generics can be expressed as:

$$O(n \times m)$$

Where:
- $n$ is the number of type parameters
- $m$ is the complexity of the constraint resolution

## Conclusion

Understanding generics is essential for writing type-safe and reusable TypeScript code. The mathematical foundation ensures type correctness while providing flexibility.

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
      id: 5,
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
    id: "3",
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
      id: 6,
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
  { name: "Technology", count: 15 },
  { name: "Programming", count: 23 },
  { name: "Design", count: 8 },
  { name: "Tutorial", count: 12 },
  { name: "News", count: 5 },
];

export const mockTagStats: TagStat[] = [
  { name: "Next.js", count: 8 },
  { name: "React", count: 12 },
  { name: "TypeScript", count: 10 },
  { name: "JavaScript", count: 15 },
  { name: "CSS", count: 7 },
  { name: "Web Development", count: 20 },
  { name: "Frontend", count: 18 },
  { name: "Backend", count: 6 },
];
