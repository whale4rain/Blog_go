// ============================================================================
// Mock Comment Data
// ============================================================================

import type { Comment } from "@/types";
import { mockUsers } from "./users";

export const mockComments: Comment[] = [
  {
    id: 1,
    article_id: "1",
    user_id: 2,
    user: mockUsers[1],
    content:
      "Great article! I've been using Next.js 14 for a few months now and the App Router is definitely a game changer. Server Components have significantly reduced my bundle size.",
    like_count: 12,
    reply_count: 2,
    created_at: "2024-03-15T12:30:00Z",
    updated_at: "2024-03-15T12:30:00Z",
  },
  {
    id: 2,
    article_id: "1",
    user_id: 3,
    user: mockUsers[2],
    p_id: 1,
    parent_comment: undefined, // Will be set in the replies
    content:
      "I agree! The performance improvements are impressive. Have you tried Turbopack yet? It's so much faster during development.",
    like_count: 5,
    reply_count: 0,
    created_at: "2024-03-15T13:15:00Z",
    updated_at: "2024-03-15T13:15:00Z",
  },
  {
    id: 3,
    article_id: "1",
    user_id: 4,
    user: mockUsers[3],
    p_id: 1,
    parent_comment: undefined, // Will be set in the replies
    content:
      "Thanks for sharing! I'm still learning about Server Components. Do you have any good resources for understanding them better?",
    like_count: 3,
    reply_count: 0,
    created_at: "2024-03-15T14:20:00Z",
    updated_at: "2024-03-15T14:20:00Z",
  },
  {
    id: 4,
    article_id: "2",
    user_id: 1,
    user: mockUsers[0],
    content:
      "Excellent explanation of generics! I especially liked the practical examples. The Box interface example is something I use frequently in my projects.",
    like_count: 18,
    reply_count: 1,
    created_at: "2024-03-14T16:45:00Z",
    updated_at: "2024-03-14T16:45:00Z",
  },
  {
    id: 5,
    article_id: "2",
    user_id: 2,
    user: mockUsers[1],
    p_id: 4,
    parent_comment: undefined, // Will be set in the replies
    content:
      "Thanks John! I'm glad you found it helpful. I'm planning to write a follow-up article on advanced generic patterns. Would you be interested in that?",
    like_count: 7,
    reply_count: 0,
    created_at: "2024-03-14T17:30:00Z",
    updated_at: "2024-03-14T17:30:00Z",
  },
  {
    id: 6,
    article_id: "3",
    user_id: 3,
    user: mockUsers[2],
    content:
      "CSS Grid has completely changed how I approach layouts. The combination of Grid and Flexbox is so powerful. I wish more developers would take the time to learn these modern techniques.",
    like_count: 9,
    reply_count: 0,
    created_at: "2024-03-13T11:00:00Z",
    updated_at: "2024-03-13T11:00:00Z",
  },
  {
    id: 7,
    article_id: "3",
    user_id: 4,
    user: mockUsers[3],
    content:
      "As a designer, I appreciate when developers understand modern CSS. It makes the handoff process so much smoother. Custom properties are especially useful for maintaining design consistency.",
    like_count: 15,
    reply_count: 1,
    created_at: "2024-03-13T12:15:00Z",
    updated_at: "2024-03-13T12:15:00Z",
  },
  {
    id: 8,
    article_id: "3",
    user_id: 1,
    user: mockUsers[0],
    p_id: 7,
    parent_comment: undefined, // Will be set in the replies
    content:
      "Absolutely! I've started using CSS custom properties for theming in my recent projects. It makes implementing dark mode so much easier.",
    like_count: 6,
    reply_count: 0,
    created_at: "2024-03-13T13:00:00Z",
    updated_at: "2024-03-13T13:00:00Z",
  },
];

// Set up parent relationships
mockComments[1].parent_comment = mockComments[0]; // Comment 2 is reply to Comment 1
mockComments[2].parent_comment = mockComments[0]; // Comment 3 is reply to Comment 1
mockComments[4].parent_comment = mockComments[3]; // Comment 5 is reply to Comment 4
mockComments[7].parent_comment = mockComments[6]; // Comment 8 is reply to Comment 7

// Group comments by article ID
export const getCommentsByArticleId = (articleId: string): Comment[] => {
  return mockComments.filter((comment) => comment.article_id === articleId);
};

// Get top-level comments (no parent)
export const getTopLevelComments = (articleId: string): Comment[] => {
  return mockComments.filter(
    (comment) => comment.article_id === articleId && !comment.p_id,
  );
};

// Get replies for a specific comment
export const getReplies = (parentId: number): Comment[] => {
  return mockComments.filter((comment) => comment.p_id === parentId);
};
