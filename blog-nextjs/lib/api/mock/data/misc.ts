// ============================================================================
// Mock Miscellaneous Data
// ============================================================================

import type {
  FriendLink,
  Feedback,
  Advertisement,
  CaptchaResponse,
  WebsiteInfo,
  DashboardStats
} from "@/types";

// Friend Links
export const mockFriendLinks: FriendLink[] = [
  {
    id: 1,
    name: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    logo: "https://picsum.photos/seed/nextjs/50/50.jpg",
    description: "Official Next.js documentation",
    status: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "React Blog",
    url: "https://react.dev/blog",
    logo: "https://picsum.photos/seed/react/50/50.jpg",
    description: "Official React blog",
    status: 1,
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    logo: "https://picsum.photos/seed/typescript/50/50.jpg",
    description: "Official TypeScript documentation",
    status: 1,
    created_at: "2024-01-03T00:00:00Z",
  },
  {
    id: 4,
    name: "Tailwind CSS",
    url: "https://tailwindcss.com/docs",
    logo: "https://picsum.photos/seed/tailwind/50/50.jpg",
    description: "Utility-first CSS framework",
    status: 1,
    created_at: "2024-01-04T00:00:00Z",
  },
];

// Feedback
export const mockFeedback: Feedback[] = [
  {
    id: 1,
    user_id: 2,
    user: {
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
    content: "Great blog! I love the clean design and helpful content. Would be nice to have a dark mode feature.",
    reply: "Thank you for your feedback! Dark mode is definitely on our roadmap for the next release.",
    status: 1,
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T14:30:00Z",
  },
  {
    id: 2,
    user_id: 3,
    user: {
      id: 3,
      uuid: "user-uuid-3",
      username: "Bob Wilson",
      email: "bob@example.com",
      avatar: "https://picsum.photos/seed/user3/100/100.jpg",
      role: "user",
      status: 1,
      signature: "Full-stack developer",
      address: "Austin, TX",
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    },
    content: "The search functionality could be improved. It's hard to find older articles.",
    reply: undefined,
    status: 0,
    created_at: "2024-03-11T15:20:00Z",
    updated_at: "2024-03-11T15:20:00Z",
  },
];

// Advertisements
export const mockAdvertisements: Advertisement[] = [
  {
    id: 1,
    title: "Next.js Course - 50% Off",
    image: "https://picsum.photos/seed/ad1/300/250.jpg",
    url: "https://example.com/nextjs-course",
    position: "sidebar",
    status: 1,
    sort: 1,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: 2,
    title: "React Developer Tools",
    image: "https://picsum.photos/seed/ad2/728/90.jpg",
    url: "https://example.com/react-tools",
    position: "header",
    status: 1,
    sort: 2,
    created_at: "2024-03-02T00:00:00Z",
  },
];

// Captcha
export const mockCaptcha: CaptchaResponse = {
  captcha_id: "captcha-" + Math.random().toString(36).substr(2, 9),
  pic_path: "https://picsum.photos/seed/captcha/120/40.jpg",
};

// Website Info
export const mockWebsiteInfo: WebsiteInfo = {
  name: "Modern Blog",
  logo: "https://picsum.photos/seed/logo/200/50.jpg",
  description: "A modern blog platform built with Next.js and TypeScript",
  keywords: "blog, nextjs, react, typescript, web development",
  author: "Blog Team",
  icp: "ICP备案号12345678",
  created_at: "2024-01-01T00:00:00Z",
};

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  total_articles: 63,
  total_users: 1247,
  total_comments: 892,
  total_views: 45678,
};

// Email verification codes (in-memory store for mock)
export const mockEmailVerificationCodes = new Map<string, { code: string; expires: number }>();

// Login attempts tracking (for rate limiting in mock)
export const mockLoginAttempts = new Map<string, { count: number; lastAttempt: number }>();
