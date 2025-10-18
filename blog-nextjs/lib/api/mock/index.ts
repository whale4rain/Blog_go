// ============================================================================
// Mock API Implementation
// ============================================================================

import type {
  ApiResponse,
  Article,
  ArticleListItem,
  CreateArticleRequest,
  UpdateArticleRequest,
  CategoryStat,
  TagStat,
  Comment,
  CreateCommentRequest,
  User,
  UserInfo,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  UserChartData,
  PaginatedResponse,
  FriendLink,
  CreateFriendLinkRequest,
  Feedback,
  CreateFeedbackRequest,
  ReplyFeedbackRequest,
  Advertisement,
  CaptchaResponse,
  Image,
  UploadImageResponse,
  ArticleSearchParams,
} from "@/types";

import {
  mockArticles,
  mockCategoryStats,
  mockTagStats,
} from "./data/articles";
import {
  mockUsers,
  mockUserChartData,
  mockLoginResponse,
  mockRegisterResponse,
} from "./data/users";
import {
  mockComments,
  getCommentsByArticleId,
  getTopLevelComments,
  getReplies,
} from "./data/comments";
import {
  mockFriendLinks,
  mockFeedback,
  mockAdvertisements,
  mockCaptcha,
  mockWebsiteInfo,
  mockDashboardStats,
  mockEmailVerificationCodes,
  mockLoginAttempts,
} from "./data/misc";

// ============================================================================
// Configuration
// ============================================================================

export const USE_MOCK_API = true;

// ============================================================================
// Helper Functions
// ============================================================================

const delay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const createApiResponse = <T>(data: T, msg: string = "Success"): ApiResponse<T> => {
  return {
    code: 200,
    data,
    msg,
  };
};

const createPaginatedResponse = <T>(
  list: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> => {
  const total = list.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedList = list.slice(startIndex, endIndex);

  return {
    list: paginatedList,
    total,
    page,
    page_size: pageSize,
  };
};

const generateId = (): number => {
  return Math.max(...mockArticles.map(a => a.id), ...mockUsers.map(u => u.id), ...mockComments.map(c => c.id)) + 1;
};

// ============================================================================
// Mock API Implementation
// ============================================================================

export const mockApi = {
  // ------------------------------------------------------------------------
  // Article API
  // ------------------------------------------------------------------------

  async getArticleById(id: number): Promise<Article> {
    await delay();
    const article = mockArticles.find(a => a.id === id);
    if (!article) {
      throw new Error(`Article with id ${id} not found`);
    }
    return article;
  },

  async searchArticles(params: ArticleSearchParams): Promise<PaginatedResponse<ArticleListItem>> {
    await delay();
    let filteredArticles = [...mockArticles];

    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.abstract.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      );
    }

    if (params.category) {
      filteredArticles = filteredArticles.filter(article =>
        article.category === params.category
      );
    }

    if (params.tag) {
      filteredArticles = filteredArticles.filter(article =>
        article.tags.includes(params.tag!)
      );
    }

    // Apply sorting
    if (params.sort) {
      filteredArticles.sort((a, b) => {
        const aValue = a[params.sort!];
        const bValue = b[params.sort!];

        if (params.order === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Convert to ArticleListItem format
    const listItems: ArticleListItem[] = filteredArticles.map(article => ({
      id: article.id,
      cover: article.cover,
      title: article.title,
      category: article.category,
      tags: article.tags,
      abstract: article.abstract,
      author: {
        id: article.author.id,
        username: article.author.username,
        avatar: article.author.avatar,
      },
      view_count: article.view_count,
      like_count: article.like_count,
      comment_count: article.comment_count,
      created_at: article.created_at,
    }));

    return createPaginatedResponse(
      listItems,
      params.page || 1,
      params.page_size || 10
    );
  },

  async getArticleCategory(): Promise<CategoryStat[]> {
    await delay();
    return mockCategoryStats;
  },

  async getArticleTags(): Promise<TagStat[]> {
    await delay();
    return mockTagStats;
  },

  async articleLike(articleId: number): Promise<void> {
    await delay();
    const article = mockArticles.find(a => a.id === articleId);
    if (article) {
      article.like_count++;
    }
  },

  async checkIsLiked(articleId: number): Promise<boolean> {
    await delay();
    // In a real app, this would check against user's likes
    return Math.random() > 0.5;
  },

  async getArticleList(params: { page?: number; page_size?: number }): Promise<PaginatedResponse<ArticleListItem>> {
    await delay();
    const listItems: ArticleListItem[] = mockArticles.map(article => ({
      id: article.id,
      cover: article.cover,
      title: article.title,
      category: article.category,
      tags: article.tags,
      abstract: article.abstract,
      author: {
        id: article.author.id,
        username: article.author.username,
        avatar: article.author.avatar,
      },
      view_count: article.view_count,
      like_count: article.like_count,
      comment_count: article.comment_count,
      created_at: article.created_at,
    }));

    return createPaginatedResponse(
      listItems,
      params.page || 1,
      params.page_size || 10
    );
  },

  // ------------------------------------------------------------------------
  // User API
  // ------------------------------------------------------------------------

  async login(data: LoginRequest): Promise<UserInfo> {
    await delay();

    // Check rate limiting
    const attempts = mockLoginAttempts.get(data.email);
    const now = Date.now();
    if (attempts && now - attempts.lastAttempt < 5 * 60 * 1000 && attempts.count >= 5) {
      throw new Error("Too many login attempts. Please try again later.");
    }

    // Mock authentication
    const user = mockUsers.find(u => u.email === data.email);
    if (!user || user.status === 0) {
      // Update failed attempts
      if (attempts) {
        attempts.count++;
        attempts.lastAttempt = now;
      } else {
        mockLoginAttempts.set(data.email, { count: 1, lastAttempt: now });
      }
      throw new Error("Invalid email or password");
    }

    // Clear failed attempts on success
    mockLoginAttempts.delete(data.email);

    return {
      user,
      access_token: "mock-token-" + Math.random().toString(36).substr(2, 9),
      access_token_expires_at: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  async register(data: RegisterRequest): Promise<UserInfo> {
    await delay();

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Check verification code
    const verification = mockEmailVerificationCodes.get(data.email);
    if (!verification || verification.code !== data.verification_code || Date.now() > verification.expires) {
      throw new Error("Invalid or expired verification code");
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      uuid: "user-" + Math.random().toString(36).substr(2, 9),
      username: data.username,
      email: data.email,
      role: "user",
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    mockEmailVerificationCodes.delete(data.email);

    return {
      user: newUser,
      access_token: "mock-token-" + Math.random().toString(36).substr(2, 9),
      access_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  async logout(): Promise<void> {
    await delay();
    // Mock logout - in real app would invalidate token
  },

  async getUserInfo(): Promise<UserInfo> {
    await delay();
    // Mock current user - in real app would decode token
    return mockLoginResponse;
  },

  async sendEmailVerificationCode(email: string): Promise<void> {
    await delay();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    mockEmailVerificationCodes.set(email, { code, expires });

    console.log(`Mock: Verification code for ${email} is ${code}`);
  },

  // ------------------------------------------------------------------------
  // Comment API
  // ------------------------------------------------------------------------

  async createComment(data: CreateCommentRequest): Promise<Comment> {
    await delay();

    const newComment: Comment = {
      id: generateId(),
      article_id: data.article_id,
      user_id: 1, // Mock current user
      user: mockUsers[0],
      p_id: data.p_id,
      content: data.content,
      like_count: 0,
      reply_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockComments.push(newComment);

    // Update parent comment reply count
    if (data.p_id) {
      const parentComment = mockComments.find(c => c.id === data.p_id);
      if (parentComment) {
        parentComment.reply_count++;
      }
    }

    return newComment;
  },

  async getCommentList(params: {
    article_id: number;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Comment>> {
    await delay();

    const comments = getTopLevelComments(params.article_id);

    // Attach replies to comments
    const commentsWithReplies = comments.map(comment => ({
      ...comment,
      replies: getReplies(comment.id),
    }));

    return createPaginatedResponse(
      commentsWithReplies,
      params.page || 1,
      params.page_size || 10
    );
  },

  // ------------------------------------------------------------------------
  // Base API
  // ------------------------------------------------------------------------

  async getCaptcha(): Promise<CaptchaResponse> {
    await delay();
    return {
      captcha_id: "captcha-" + Math.random().toString(36).substr(2, 9),
      pic_path: "https://picsum.photos/seed/captcha/120/40.jpg",
    };
  },

  // ------------------------------------------------------------------------
  // Friend Link API
  // ------------------------------------------------------------------------

  async getFooterFriendLinks(): Promise<FriendLink[]> {
    await delay();
    return mockFriendLinks.filter(link => link.status === 1);
  },

  // ------------------------------------------------------------------------
  // Website Info API
  // ------------------------------------------------------------------------

  async getWebsiteInfo(): Promise<any> {
    await delay();
    return mockWebsiteInfo;
  },
};
