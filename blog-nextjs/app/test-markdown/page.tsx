// ============================================================================
// Test Markdown Page - Enhanced Page to Test Markdown Rendering Features
// ============================================================================

import React from "react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

const testContent = `
# 🎨 Enhanced Markdown Rendering Test

This page demonstrates the complete Markdown rendering capabilities with **Google-inspired design styling**, including syntax highlighting, Mermaid diagrams, and LaTeX formulas.

## 📝 Basic Markdown Features

### Text Formatting

**Bold text**, *italic text*, and ~~strikethrough~~ text with proper styling.

### Lists

#### Unordered Lists
- Feature 1: Syntax highlighting
- Feature 2: Mermaid diagrams
- Feature 3: LaTeX formulas
  - Sub-feature A: Inline math
  - Sub-feature B: Block math

#### Ordered Lists
1. First priority: User experience
2. Second priority: Performance
3. Third priority: Accessibility

### Code Examples

Inline code: \`const greeting = "Hello, World!";\`

Code block with syntax highlighting:
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
}

function createUser(userData: Omit<User, 'id'>): User {
  return {
    id: Math.floor(Math.random() * 1000),
    ...userData
  };
}

const user = createUser({
  name: "John Doe",
  email: "john@example.com",
  role: "user"
});
\`\`\`

## 🎯 Mermaid Diagrams with Custom Styling

### System Architecture Flowchart

\`\`\`mermaid
graph TB
    A[🌐 User Interface] --> B[🔄 Next.js App Router]
    B --> C[⚡ Server Components]
    B --> D[💻 Client Components]

    C --> E[🗄️ Database]
    D --> F[🔄 State Management]

    E --> G[📊 Response Data]
    F --> G

    G --> H[🎨 Markdown Renderer]
    H --> I[📈 Mermaid Processing]
    I --> J[🔤 LaTeX Rendering]

    J --> K[✅ Final Output]

    style A fill:#4285f4,stroke:#5c94f5,stroke-width:2px,color:#fff
    style B fill:#34a853,stroke:#5c94f5,stroke-width:2px,color:#fff
    style C fill:#fbbc04,stroke:#5c94f5,stroke-width:2px,color:#000
    style D fill:#ea4335,stroke:#5c94f5,stroke-width:2px,color:#fff
\`\`\`

### User Authentication Flow

\`\`\`mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 📱 Frontend
    participant A as 🔐 Auth Service
    participant D as 🗄️ Database

    U->>F: Login Request
    F->>A: Validate Credentials
    A->>D: Query User Data
    D-->>A: User Information
    A-->>F: JWT Token + User Data
    F-->>U: Login Success

    Note over U,D: User now authenticated

    U->>F: Access Protected Route
    F->>A: Verify JWT Token
    A-->>F: Token Valid
    F-->>U: Protected Content
\`\`\`

### Development Workflow

\`\`\`mermaid
gantt
    title 🚀 Blog Development Timeline
    dateFormat  YYYY-MM-DD
    section Core Features
    Authentication           :done, auth, 2024-01-01, 2024-01-07
    Markdown Rendering      :done, md, 2024-01-08, 2024-01-15
    Mermaid Integration     :active, mermaid, 2024-01-16, 2024-01-20
    LaTeX Support           :latex, after mermaid, 3d

    section UI/UX
    Dashboard Design        :done, dash, 2024-01-05, 2024-01-12
    Responsive Layout       :done, responsive, 2024-01-10, 2024-01-18
    Dark Mode              :dark, after responsive, 5d

    section Testing
    Unit Tests              :test1, after latex, 4d
    Integration Tests       :test2, after test1, 3d
    E2E Tests              :test3, after test2, 5d
\`\`\`

## 🧮 Mathematical Formulas with LaTeX

### Inline Mathematics

The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ and the area of a circle is $A = \\pi r^2$.

### Block Mathematics

#### Pythagorean Theorem

$$a^2 + b^2 = c^2$$

Where $a$ and $b$ are the legs of a right triangle and $c$ is the hypotenuse.

#### Complex Analysis

Euler's identity, often called the most beautiful equation in mathematics:

$$e^{i\\pi} + 1 = 0$$

This connects five fundamental mathematical constants: $e$, $i$, $\\pi$, $1$, and $0$.

#### Calculus

The fundamental theorem of calculus:

$$\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$$

#### Linear Algebra

Matrix multiplication example:

$$\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
\\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}$$

#### Statistics

Normal distribution formula:

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$

## 📊 Feature Comparison Table

| Feature | Status | Implementation | Design System |
|---------|--------|----------------|---------------|
| **Markdown Rendering** | ✅ Complete | \`react-markdown\` | Google-inspired |
| **Syntax Highlighting** | ✅ Complete | \`highlight.js\` | GitHub Dark Theme |
| **Mermaid Diagrams** | ✅ Complete | \`mermaid\` | Custom Styled |
| **LaTeX Formulas** | ✅ Complete | \`KaTeX\` | Responsive |
| **Code Blocks** | ✅ Complete | Custom Component | Themed |
| **Tables** | ✅ Complete | Native Markdown | Styled |
| **Responsive Design** | ✅ Complete | Tailwind CSS | Mobile-First |
| **Dark Mode Support** | 🔄 In Progress | CSS Variables | Planned |

## 💡 Advanced Features

### Blockquotes with Nested Content

> 💡 **Pro Tip**: This Markdown renderer supports advanced features including:
>
> - 🎨 Custom styling that matches the Google design system
> - 📱 Fully responsive layout
> - ⚡ Optimized performance with lazy loading
> - 🔧 Extensible component architecture
>
> > 📝 **Note**: The styling automatically adapts to your theme preferences.

### Code with Annotations

\`\`\`javascript
// 🚀 Initialize the application
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

// 📊 Configure renderer options
const options = {
  enableMermaid: true,
  enableLaTeX: true,
  theme: 'google-inspired'
};

// 🎨 Render enhanced content
const content = \`# Hello World\n\nThis is **enhanced** markdown!\`;

return <MarkdownRenderer content={content} className="prose-lg" />;
\`\`\`

## 🔗 External Links

- 📚 [Next.js Documentation](https://nextjs.org/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com)
- 📊 [Mermaid Documentation](https://mermaid.js.org)
- 🧮 [KaTeX Documentation](https://katex.org)
- 💻 [React Markdown](https://github.com/remarkjs/react-markdown)

---

## 🎉 Conclusion

This enhanced test page demonstrates all the Markdown rendering features working together seamlessly with a **cohesive Google-inspired design system**. The combination of proper typography, consistent spacing, and thoughtful color choices creates a professional and user-friendly reading experience.

### ✨ Key Highlights

- 🎨 **Consistent Design**: All elements follow the Google design language
- 📱 **Responsive**: Works perfectly on all device sizes
- ⚡ **Performance**: Optimized rendering with lazy loading
- 🔧 **Maintainable**: Clean, extensible component architecture
- ♿ **Accessible**: Proper semantic markup and ARIA support

**Result**: A production-ready Markdown renderer that enhances content without overwhelming the user! 🚀
`;

export default function TestMarkdownPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-4">
              Markdown Rendering Test
            </h1>
            <p className="text-center text-muted-foreground">
              Test page for Markdown, Mermaid diagrams, and LaTeX formulas
            </p>
          </div>

          <div className="card p-8">
            <MarkdownRenderer content={testContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
