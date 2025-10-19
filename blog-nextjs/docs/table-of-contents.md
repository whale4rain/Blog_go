# Table of Contents Feature Documentation

## Overview

The Table of Contents (TOC) feature provides an interactive sidebar navigation for articles, allowing users to quickly jump between sections and track their reading progress.

## Features

### 🎯 Core Functionality
- **Automatic Heading Detection**: Parses Markdown content to extract H1-H6 headings
- **Hierarchical Structure**: Maintains proper heading hierarchy with indentation
- **Smooth Scrolling**: Animated scrolling to target sections with offset for fixed headers
- **Active State Tracking**: Highlights current section based on scroll position
- **Progress Indicator**: Visual progress bar showing reading completion

### 📱 Responsive Design
- **Desktop**: Fixed sidebar with collapse/expand functionality
- **Mobile**: Floating action button with slide-out drawer
- **Adaptive Layout**: Hides on small screens, shows on larger screens

### 🎨 Visual Features
- **Google-inspired Design**: Consistent with website color scheme
- **Hover Effects**: Interactive feedback on navigation items
- **Smooth Transitions**: CSS animations for all interactions
- **Collapsed State**: Minimal progress indicators when collapsed

## Implementation Details

### Component Structure

```
components/ui/TableOfContents.tsx
├── parseHeadings()      - Extract headings from markdown
├── handleScroll()       - Track active heading
├── scrollToHeading()    - Smooth scroll to section
└── renderHeadingItems() - Recursive rendering of hierarchy
```

### Key Technologies
- **React Hooks**: useState, useEffect for state management
- **Regular Expressions**: Parse markdown headings
- **Intersection Observer**: Track scroll position
- **CSS-in-JS**: Dynamic styling and animations

### Integration Points

#### ArticleClient Component
```tsx
<div className="flex gap-8">
  <div className="flex-1 min-w-0">
    {/* Article content */}
  </div>
  <TableOfContents content={article.content} />
</div>
```

#### MarkdownRenderer Component
```tsx
h1: ({ children, ...props }) => {
  const text = React.Children.toArray(children).join("");
  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  return <h1 id={id} className="scroll-mt-24">{children}</h1>;
}
```

## Usage Instructions

### Basic Usage
```tsx
import TableOfContents from "@/components/ui/TableOfContents";

<TableOfContents 
  content={markdownContent} 
  className="hidden lg:block" 
/>
```

### Props
- `content: string` - Markdown content to parse
- `className?: string` - Additional CSS classes

### CSS Classes
- `.table-of-contents` - Main container
- `.toc-link` - Navigation link
- `.toc-item` - Navigation item
- `.toc-progress` - Progress indicator

## Customization

### Styling
The component uses Tailwind CSS classes and can be customized through:
- CSS variables for colors
- Tailwind utility classes
- Custom CSS overrides

### Behavior
- Scroll offset: 80px (adjustable in `scrollToHeading`)
- Breakpoint: lg (1024px) for responsive display
- Animation duration: 200-300ms for transitions

## Testing

### Test Page
Access `/test-toc` to see the feature in action with various content types:
- Multiple heading levels
- Mathematical formulas
- Mermaid diagrams
- Code blocks
- Tables and lists

### Test Articles
The mock articles in the system already contain proper heading structure:
- Article 1: "Getting Started with Next.js 14"
- Article 2: "Understanding TypeScript Generics"

## Browser Support

### Modern Browsers
- Chrome 61+
- Firefox 60+
- Safari 14+
- Edge 79+

### Features Used
- CSS Grid and Flexbox
- CSS Custom Properties
- Intersection Observer API
- Smooth Scrolling

## Performance Considerations

### Optimizations
- Debounced scroll events
- Lazy rendering of headings
- Efficient DOM queries
- Minimal re-renders

### Bundle Size
- Component size: ~3KB gzipped
- No additional dependencies
- Uses existing Lucide icons

## Future Enhancements

### Planned Features
- Search within TOC
- Keyboard navigation
- Print-friendly version
- Dark mode support
- Accessibility improvements

### Potential Improvements
- Virtual scrolling for very long articles
- Local storage for reading position
- Analytics integration for tracking
- Export TOC as separate page

## Troubleshooting

### Common Issues

#### TOC Not Appearing
- Check if content has headings
- Verify content prop is passed correctly
- Ensure CSS classes are applied

#### Scroll Not Working
- Check if headings have proper IDs
- Verify scroll offset is correct
- Check for CSS conflicts

#### Active State Not Updating
- Verify scroll event listeners
- Check heading element selection
- Ensure proper ID matching

### Debug Tips
- Use browser dev tools to inspect generated IDs
- Check console for JavaScript errors
- Verify CSS classes are applied correctly
- Test with different content types

## Conclusion

The Table of Contents feature significantly improves the user experience for long-form content by providing easy navigation and reading progress tracking. It's fully responsive, accessible, and integrates seamlessly with the existing article system.