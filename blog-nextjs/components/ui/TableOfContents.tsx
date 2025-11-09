// ============================================================================
// Table of Contents Component - Article Navigation Sidebar
// ============================================================================

"use client";

import { ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export default function TableOfContents({
  content,
  className = "",
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Parse headings from markdown content
  useEffect(() => {
    const parseHeadings = () => {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      const items: TocItem[] = [];
      const stack: TocItem[] = [];
      let match;

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        const item: TocItem = {
          id,
          text,
          level,
        };

        // Build hierarchical structure
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        if (stack.length === 0) {
          items.push(item);
        } else {
          const parent = stack[stack.length - 1];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
        }

        stack.push(item);
      }

      setHeadings(items);
    };

    if (content) {
      parseHeadings();
    }
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6",
      );

      let currentId = "";
      headingElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          currentId = element.id;
        }
      });

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Close mobile menu after click
      if (window.innerWidth < 1024) {
        setIsMobileOpen(false);
      }
    }
  };

  // Render heading items recursively
  const renderHeadingItems = (items: TocItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} className="toc-item">
        <button
          onClick={() => scrollToHeading(item.id)}
          className={`
            toc-link
            w-full text-left px-3 py-2 rounded-md transition-all duration-200
            flex items-center gap-2 group hover:bg-muted/50
            ${
              activeId === item.id
                ? "bg-google-blue/10 text-google-blue font-medium border-l-2 border-google-blue"
                : "text-muted-foreground hover:text-foreground"
            }
            ${level > 0 ? "ml-" + level * 4 : ""}
          `}
          style={{ marginLeft: `${level * 16}px` }}
        >
          <ChevronRight
            className={`
              w-3 h-3 transition-transform duration-200
              ${activeId === item.id ? "rotate-90" : ""}
              group-hover:rotate-90
            `}
          />
          <span className="text-sm truncate">{item.text}</span>
        </button>
        {item.children && item.children.length > 0 && (
          <div className="mt-1">
            {renderHeadingItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-google-blue text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[hsl(214,90%,48%)] transition-colors"
        aria-label="Toggle table of contents"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Table of Contents */}
      <div
        className={`
        table-of-contents
        ${isMobileOpen ? "fixed inset-y-0 right-0 z-50 w-80" : "hidden lg:block"}
        lg:relative lg:z-auto
        ${isCollapsed ? "lg:w-16" : "lg:w-[25%]"}
        ${className}
      `}
      >
        <div
          className="
          h-full bg-card border-l border-border
          lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]
          overflow-hidden flex flex-col
          shadow-xl lg:shadow-none
        "
        >
          {/* Header */}
          <div
            className={`
            flex items-center justify-between p-4 border-b border-border
            bg-muted/30
          `}
          >
            {!isCollapsed && (
              <h3 className="font-semibold text-foreground text-sm">
                Table of Contents
              </h3>
            )}
            <div className="flex items-center gap-2">
              {/* Collapse Toggle (Desktop) */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
                aria-label={isCollapsed ? "Expand" : "Collapse"}
              >
                <ChevronRight
                  className={`
                    w-4 h-4 text-muted-foreground transition-transform duration-200
                    ${isCollapsed ? "" : "rotate-180"}
                  `}
                />
              </button>

              {/* Close Button (Mobile) */}
              {isMobileOpen && (
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div
            className={`
            flex-1 overflow-y-auto p-4
            ${isCollapsed ? "px-2 py-4" : ""}
          `}
          >
            {isCollapsed ? (
              // Collapsed state - show only heading indicators
              <div className="space-y-2">
                {headings.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToHeading(item.id);
                      setIsCollapsed(false);
                    }}
                    className={`
                      w-full h-2 rounded-full transition-all duration-200
                      ${
                        activeId === item.id
                          ? "bg-google-blue"
                          : "bg-muted hover:bg-muted-foreground/30"
                      }
                    `}
                    style={{
                      width: `${Math.max(20, Math.min(100, 60 - item.level * 15))}%`,
                      marginLeft: `${item.level * 4}px`,
                    }}
                    title={item.text}
                  />
                ))}
              </div>
            ) : (
              // Expanded state - show full navigation
              <nav className="space-y-1">{renderHeadingItems(headings)}</nav>
            )}
          </div>

          {/* Progress Indicator */}
          {!isCollapsed && (
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="text-xs text-muted-foreground mb-2">
                Reading Progress
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-google-blue h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${headings.length > 0 ? ((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
