// ============================================================================
// Site Configuration
// ============================================================================

export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  logo: {
    text: string;
    gradient: {
      from: string;
      to: string;
    };
    imageUrl?: string; // 可选的图片 URL，如果设置则使用图片而不是文字
  };
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  links: {
    home: string;
    about: string;
    search: string;
    dashboard: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "whale4blog",
  shortName: "W4",
  description: "A modern blog platform built with Next.js and Google-inspired design",
  logo: {
    text: "W4",
    gradient: {
      from: "google-blue", // Tailwind class
      to: "white",
    },
    // imageUrl: "/logo.png", // 取消注释并设置图片路径来使用图片logo
  },
  social: {
    github: "https://github.com/whale4rain",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    email: "contact@whale4blog.com",
  },
  links: {
    home: "/",
    about: "/about",
    search: "/search",
    dashboard: "/dashboard",
  },
};

export default siteConfig;
