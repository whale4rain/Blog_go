// ============================================================================
// Markdown Renderer Component - Render Markdown with Syntax Highlighting, Mermaid & LaTeX
// ============================================================================

"use client";

import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "prose prose-lg max-w-none dark:prose-invert",
}: MarkdownRendererProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Process Mermaid diagrams after render
  useEffect(() => {
    const processMermaidDiagrams = async () => {
      const mermaidElements =
        mermaidRef.current?.querySelectorAll(".mermaid-diagram");

      if (!mermaidElements || mermaidElements.length === 0) return;

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        // Configure Mermaid with website design theme
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            // Google-inspired colors matching website theme
            primaryColor: "hsl(214, 90%, 52%)", // google-blue
            primaryTextColor: "#ffffff",
            primaryBorderColor: "hsl(214, 90%, 65%)",
            secondaryColor: "hsl(214, 90%, 48%)",
            tertiaryColor: "hsl(214, 90%, 95%)",
            background: "hsl(0, 0%, 100%)", // card background

            // Node backgrounds
            mainBkg: "hsl(0, 0%, 100%)", // white background
            secondBkg: "hsl(210, 40%, 96%)", // muted background
            tertiaryBkg: "hsl(210, 40%, 92%)", // darker muted

            // Text colors
            textColor: "hsl(215, 25%, 27%)", // foreground
            secondaryTextColor: "hsl(215, 10%, 46%)", // muted-foreground
            tertiaryTextColor: "hsl(215, 10%, 36%)",

            // Border colors
            borderColor: "hsl(210, 40%, 87%)", // border
            secondaryBorderColor: "hsl(210, 40%, 77%)",
            tertiaryBorderColor: "hsl(210, 40%, 67%)",

            // Line and arrow colors
            lineColor: "hsl(210, 40%, 87%)",
            edgeLabelBackground: "hsl(210, 40%, 96%)",

            // Special colors for different node types
            altBackground: "hsl(142, 71%, 45%)", // google-green
            altBkg: "hsl(142, 71%, 45%)",
            altBorderColor: "hsl(142, 71%, 55%)",
            altTextColor: "#ffffff",

            // Error colors
            errorBkg: "hsl(4, 90%, 58%)", // google-red
            errorTextColor: "#ffffff",

            // Success colors
            successBkg: "hsl(142, 71%, 45%)", // google-green
            successTextColor: "#ffffff",

            // Warning colors
            warningBkg: "hsl(45, 100%, 51%)", // google-yellow
            warningTextColor: "hsl(0, 0%, 27%)",
          },
          fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
          fontSize: 14,
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
            padding: 20,
          },
          sequence: {
            useMaxWidth: true,
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
            bottomMarginAdj: 1,
          },
          gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            barGap: 4,
            topPadding: 50,
            leftPadding: 75,
            gridLineStartPadding: 35,
            fontSize: 11,
            sectionFontSize: 11,
            numberSectionStyles: 4,
            axisFormat: "%Y-%m-%d",
            tickInterval: "day",
          },
        });

        // Render each Mermaid diagram
        for (const element of mermaidElements) {
          if (element.getAttribute("data-processed") === "true") continue;

          try {
            const graphDefinition = (element as HTMLElement).textContent || "";
            if (graphDefinition.trim()) {
              const { svg } = await mermaid.render(
                `mermaid-${Math.random().toString(36).substr(2, 9)}`,
                graphDefinition.trim(),
              );
              element.innerHTML = svg;
              element.setAttribute("data-processed", "true");
            }
          } catch (error) {
            console.error("Mermaid rendering error:", error);
            element.innerHTML = `<div class="text-google-red p-2 border border-google-red rounded text-sm">Mermaid diagram error: ${error instanceof Error ? error.message : "Unknown error"}</div>`;
          }
        }
      } catch (error) {
        console.error("Failed to load Mermaid:", error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(processMermaidDiagrams, 200);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className={className} ref={mermaidRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
        components={{
          // Custom components for better styling
          h1: ({ children, ...props }) => (
            <h1
              className="text-3xl font-bold text-foreground mb-6 mt-8 first:mt-0 border-b border-border pb-3"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-2xl font-bold text-foreground mb-4 mt-6 first:mt-0"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-xl font-bold text-foreground mb-3 mt-5 first:mt-0"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-lg font-semibold text-foreground mb-2 mt-4 first:mt-0"
              {...props}
            >
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p
              className="text-foreground leading-relaxed mb-4 first:mt-0"
              {...props}
            >
              {children}
            </p>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-google-blue hover:text-google-blue/80 underline transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="list-disc list-inside mb-4 space-y-2 text-foreground"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="list-decimal list-inside mb-4 space-y-2 text-foreground"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-foreground leading-relaxed" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-google-blue pl-4 italic text-muted-foreground my-4 bg-muted/30 py-2 rounded-r"
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ children, className, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const isInline = !className;

            // Handle Mermaid code blocks
            if (language === "mermaid") {
              return (
                <div
                  className="mermaid-diagram bg-card border border-border rounded-xl my-6 p-6 text-center overflow-x-auto shadow-sm"
                  {...props}
                >
                  {children}
                </div>
              );
            }

            return isInline ? (
              <code
                className="bg-muted px-2 py-1 rounded text-sm font-mono text-google-red"
                {...props}
              >
                {children}
              </code>
            ) : (
              <div className="relative">
                {language && (
                  <div className="absolute top-0 right-0 px-2 py-1 text-xs text-muted-foreground bg-muted rounded-bl">
                    {language}
                  </div>
                )}
                <pre
                  className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground"
                  {...props}
                >
                  <code className={className}>{children}</code>
                </pre>
              </div>
            );
          },
          pre: ({ children, ...props }) => {
            // Check if this is a Mermaid diagram
            const childElement = React.Children.toArray(
              children,
            )[0] as React.ReactElement;
            if (childElement?.props?.className?.includes("mermaid-diagram")) {
              return <div className="my-4">{children}</div>;
            }
            return (
              <pre
                className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground mb-4"
                {...props}
              >
                {children}
              </pre>
            );
          },
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table
                className="min-w-full border-collapse border border-border rounded-lg overflow-hidden"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-border px-4 py-2 text-left font-semibold text-foreground"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border border-border px-4 py-2 text-foreground"
              {...props}
            >
              {children}
            </td>
          ),
          hr: ({ ...props }) => (
            <hr className="border-border my-6" {...props} />
          ),
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt || ""}
              className="rounded-lg shadow-md max-w-full h-auto my-4"
              loading="lazy"
              {...props}
            />
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-foreground" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-foreground" {...props}>
              {children}
            </em>
          ),
          // Math components
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
