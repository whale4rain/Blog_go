// ============================================================================
// Root Layout - Next.js App Router
// ============================================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import LoginModal from "@/components/auth/LoginModal";
import UserProvider from "./providers/UserProvider";
import { AuthDebug } from "@/components/debug/AuthDebug";

// ----------------------------------------------------------------------------
// Font Configuration
// ----------------------------------------------------------------------------

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ----------------------------------------------------------------------------
// Metadata
// ----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: "Inspiration Blog",
    template: "%s | Inspiration Blog",
  },
  description:
    "A modern blog platform built with Next.js and Google-inspired design",
  keywords: ["blog", "nextjs", "react", "typescript", "google design"],
  authors: [{ name: "Inspiration Blog" }],
  creator: "Inspiration Blog",
  publisher: "Inspiration Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Inspiration Blog",
    title: "Inspiration Blog",
    description:
      "A modern blog platform built with Next.js and Google-inspired design",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inspiration Blog",
    description:
      "A modern blog platform built with Next.js and Google-inspired design",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// ----------------------------------------------------------------------------
// Viewport Configuration
// ----------------------------------------------------------------------------

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#4285f4",
};

// ----------------------------------------------------------------------------
// Root Layout Component
// ----------------------------------------------------------------------------

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* Global Loading Indicator */}
        <div id="global-loading" className="hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-6 w-6 border-3 border-google-blue border-t-transparent rounded-full" />
                <span className="text-foreground font-medium">Loading...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="relative">
          <UserProvider>{children}</UserProvider>
        </main>

        {/* Scroll to Top Button */}
        <ScrollToTopButton />

        {/* Login Modal */}
        <LoginModal />

        {/* Auth Debug - Development Only */}
        <AuthDebug />

        {/* Client-side Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Show/hide scroll to top button
              let scrollBtn = null;
              window.addEventListener('DOMContentLoaded', () => {
                scrollBtn = document.getElementById('scroll-to-top');
                window.addEventListener('scroll', () => {
                  if (scrollBtn) {
                    if (window.scrollY > 300) {
                      scrollBtn.classList.remove('hidden');
                    } else {
                      scrollBtn.classList.add('hidden');
                    }
                  }
                });
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
