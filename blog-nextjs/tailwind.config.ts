import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Google-inspired color palette
        google: {
          blue: "hsl(214, 90%, 52%)",
          green: "hsl(142, 71%, 45%)",
          yellow: "hsl(45, 100%, 51%)",
          red: "hsl(4, 90%, 58%)",
        },
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(215, 25%, 27%)",
        muted: {
          DEFAULT: "hsl(210, 40%, 96%)",
          foreground: "hsl(215, 10%, 46%)",
        },
        border: "hsl(210, 40%, 87%)",
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(215, 25%, 27%)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      spacing: {
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "8": "2rem",
        "10": "2.5rem",
        "12": "3rem",
        "16": "4rem",
        "20": "5rem",
        "24": "6rem",
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(60, 64, 67, 0.3)",
        DEFAULT: "0 1px 3px 0 rgba(60, 64, 67, 0.3)",
        md: "0 1px 3px 0 rgba(60, 64, 67, 0.3)",
        lg: "0 4px 6px -1px rgba(60, 64, 67, 0.3)",
        xl: "0 6px 10px -4px rgba(60, 64, 67, 0.3)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-in",
        "slide-in": "slideIn 200ms ease-out",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
