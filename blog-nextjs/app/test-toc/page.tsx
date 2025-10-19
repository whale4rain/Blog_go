// ============================================================================
// Table of Contents Test Page
// ============================================================================

"use client";

import React from "react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import TableOfContents from "@/components/ui/TableOfContents";

export default function TableOfContentsTest() {
  const testContent = `# Table of Contents Test Page

This is a test page to demonstrate the Table of Contents functionality.

## First Level Heading

This is the content under the first level heading.

### Second Level Heading A

This is content under the second level heading A.

#### Third Level Heading A.1

This is content under the third level heading.

##### Fourth Level Heading A.1.1

This is deep nested content.

##### Fourth Level Heading A.1.2

More deep nested content.

#### Third Level Heading A.2

More content at the third level.

### Second Level Heading B

This is content under the second level heading B.

## Mathematical Content

### Complex Formulas

Let's explore some mathematical formulas:

The quadratic formula:
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Integration:
$$\\int_{a}^{b} f(x) dx = F(b) - F(a)$$

### Matrix Operations

Matrix multiplication:
$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\times \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae + bg & af + bh \\\\ ce + dg & cf + dh \\end{pmatrix}$$

## Mermaid Diagrams

### Flowchart Example

\`\`\`mermaid
graph TB
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E
\`\`\`

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
\`\`\`

## Code Examples

### JavaScript Example

\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

### Python Example

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
\`\`\`

## Tables and Lists

### Sample Table

| Feature | Status | Priority |
|---------|--------|----------|
| TOC Navigation | ✅ Complete | High |
| Smooth Scrolling | ✅ Complete | High |
| Mobile Support | ✅ Complete | Medium |
| Progress Indicator | ✅ Complete | Low |

### Task List

- [x] Create Table of Contents component
- [x] Add heading ID generation
- [x] Implement smooth scrolling
- [x] Add active state tracking
- [x] Create mobile responsive design
- [x] Add progress indicator
- [x] Test with various content types

## Conclusion

The Table of Contents feature provides excellent navigation for long articles with multiple sections. It automatically detects headings, generates a hierarchical navigation structure, and provides smooth scrolling to the target sections.

### Key Features

1. **Automatic Detection**: Automatically parses markdown content to find headings
2. **Hierarchical Structure**: Maintains the heading hierarchy (H1, H2, H3, etc.)
3. **Active State Tracking**: Highlights the current section as you scroll
4. **Smooth Scrolling**: Provides smooth scrolling to target sections
5. **Mobile Responsive**: Works seamlessly on mobile devices
6. **Progress Indicator**: Shows reading progress through the article

### Technical Implementation

The implementation uses React hooks for state management and scroll tracking. The component parses the markdown content using regular expressions to extract headings and builds a hierarchical structure for navigation.

This concludes our test of the Table of Contents functionality!`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-12">
        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Table of Contents Test
              </h1>
              <p className="text-muted-foreground">
                This page demonstrates the Table of Contents functionality with various content types including headings, mathematical formulas, diagrams, and code examples.
              </p>
            </div>

            <MarkdownRenderer content={testContent} />
          </div>

          {/* Table of Contents Sidebar */}
          <TableOfContents content={testContent} className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
