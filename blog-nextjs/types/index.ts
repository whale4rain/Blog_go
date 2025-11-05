// ============================================================================
// Type Definitions
// ============================================================================

// ----------------------------------------------------------------------------
// Elasticsearch Types
// ----------------------------------------------------------------------------

/**
 * Elasticsearch Hit structure
 */
export interface Hit<T> {
  _id: string;
  _index: string;
  _score: number;
  _source: T;
}

/**
 * Article data structure in Elasticsearch
 */
export interface ArticleSource {
  created_at: string;
  updated_at?: string;
  cover: string;
  title: string;
  keyword?: string;
  category: string;
  tags: string[];
  abstract: string;
  content?: string;
  views: number;
  comments: number;
  likes: number;
}

// ----------------------------------------------------------------------------
// Common Types
// ----------------------------------------------------------------------------

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  page_size: number;
}

// ----------------------------------------------------------------------------
// User Types
// ----------------------------------------------------------------------------

export interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  status: number;
  signature?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface UserInfo {
  user: User;
  access_token: string;
  refresh_token?: string; // Note: This is set in HTTP-only cookie by backend, not stored in localStorage
  access_token_expires_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  captcha: string;
  captcha_id: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  verification_code: string;
}

export interface UpdateUserRequest {
  username?: string;
  address?: string;
  signature?: string;
  avatar?: string;
}

// ----------------------------------------------------------------------------
// Article Types
// ----------------------------------------------------------------------------

export interface Article {
  id: string;
  cover: string;
  title: string;
  category: string;
  tags: string[];
  abstract: string;
  content: string;
  author: User;
  author_id: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  status: number;
  is_top: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticleListItem {
  id: string;
  cover: string;
  title: string;
  category: string;
  tags: string[];
  abstract: string;
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
}

/**
 * Article search result (Elasticsearch response)
 */
export interface ArticleSearchResult {
  list: Hit<ArticleSource>[];
  total: number;
}

export interface CreateArticleRequest {
  cover: string;
  title: string;
  category: string;
  tags: string[];
  abstract: string;
  content: string;
}

export interface UpdateArticleRequest extends CreateArticleRequest {
  id: string;
}

export interface ArticleSearchParams {
  query?: string;
  category?: string;
  tag?: string;
  sort?:
    | "created_at"
    | "view_count"
    | "like_count"
    | "time"
    | "view"
    | "like"
    | "comment";
  order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}
// ----------------------------------------------------------------------------
// Comment Types
// ----------------------------------------------------------------------------

export interface Comment {
  id: number;
  article_id: string;
  user_id: number;
  user: User;
  p_id?: number;
  parent_comment?: Comment;
  content: string;
  like_count: number;
  reply_count: number;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  article_id: string;
  p_id?: number;
  content: string;
}

// ----------------------------------------------------------------------------
// Image Types
// ----------------------------------------------------------------------------

export interface Image {
  id: number;
  name: string;
  url: string;
  category?: string;
  size: number;
  oss_type: "local" | "qiniu";
  created_at: string;
}

export interface UploadImageResponse {
  url: string;
  oss_type: string;
}

// ----------------------------------------------------------------------------
// Category and Tag Types
// ----------------------------------------------------------------------------

export interface CategoryStat {
  name: string;
  count: number;
}

export interface TagStat {
  name: string;
  count: number;
}

// ----------------------------------------------------------------------------
// Friend Link Types
// ----------------------------------------------------------------------------

export interface FriendLink {
  id: number;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  status: number;
  created_at: string;
}

export interface CreateFriendLinkRequest {
  name: string;
  url: string;
  logo?: string;
  description?: string;
}

// ----------------------------------------------------------------------------
// Feedback Types
// ----------------------------------------------------------------------------

export interface Feedback {
  id: number;
  user_id: number;
  user: User;
  content: string;
  reply?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackRequest {
  content: string;
}

export interface ReplyFeedbackRequest {
  id: number;
  reply: string;
}

// ----------------------------------------------------------------------------
// Advertisement Types
// ----------------------------------------------------------------------------

export interface Advertisement {
  id: number;
  title: string;
  image: string;
  url?: string;
  position: string;
  status: number;
  sort: number;
  created_at: string;
}

// ----------------------------------------------------------------------------
// Captcha Types
// ----------------------------------------------------------------------------

export interface CaptchaResponse {
  captcha_id: string;
  pic_path: string;
}

// ----------------------------------------------------------------------------
// Statistics Types
// ----------------------------------------------------------------------------

export interface UserChartData {
  date_list: string[];
  login_data: number[];
  register_data: number[];
}

export interface DashboardStats {
  total_articles: number;
  total_users: number;
  total_comments: number;
  total_views: number;
}

// ----------------------------------------------------------------------------
// Website Info Types
// ----------------------------------------------------------------------------

export interface WebsiteInfo {
  name: string;
  logo?: string;
  description?: string;
  keywords?: string;
  author?: string;
  icp?: string;
  created_at?: string;
}

// ----------------------------------------------------------------------------
// Configuration Types
// ----------------------------------------------------------------------------

export interface SiteConfig {
  site_name: string;
  site_url: string;
  site_description: string;
  site_keywords: string;
  site_logo: string;
  site_favicon: string;
}

// ----------------------------------------------------------------------------
// Utility Types
// ----------------------------------------------------------------------------

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface PageMeta {
  title: string;
  description?: string;
  keywords?: string;
}
