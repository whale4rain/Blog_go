// ============================================================================
// Article API Functions
// ============================================================================

import type {
  Article,
  ArticleListItem,
  ArticleSearchParams,
  ArticleSource,
  CategoryStat,
  CreateArticleRequest,
  Hit,
  PaginatedResponse,
  TagStat,
  UpdateArticleRequest,
  User,
} from "@/types";
import { del, get, post, put } from "./client";

// ----------------------------------------------------------------------------
// Article CRUD Operations
// ----------------------------------------------------------------------------

/**
 * Create a new article
 */
export async function createArticle(
  data: CreateArticleRequest,
): Promise<Article> {
  return post<Article>("/article/create", data);
}

/**
 * Update an existing article
 */
export async function updateArticle(
  id: string,
  data: UpdateArticleRequest,
): Promise<Article> {
  return put<Article>("/article/update", { ...data, id });
}

/**
 * Delete article by ID
 */
export async function deleteArticle(id: string): Promise<void> {
  return del<void>("/article/delete", {
    data: { ids: [id] },
  });
}

/**
 * Delete articles by IDs
 */
export async function deleteArticles(ids: string[]): Promise<void> {
  return del<void>("/article/delete", {
    data: { ids },
  });
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string): Promise<Article> {
  // 后端返回的是 Elasticsearch Article 结构，需要转换
  const response = await get<ArticleSource>(`/article/${id}`);
  
  // 转换为前端期望的 Article 格式
  return {
    id: id,
    cover: response.cover,
    title: response.title,
    category: response.category,
    tags: response.tags,
    abstract: response.abstract,
    content: response.content || '',
    author: {} as User, // 后端不返回作者信息，需要从用户信息获取
    author_id: 0, // 后端不返回作者ID
    view_count: response.views,
    like_count: response.likes,
    comment_count: response.comments,
    status: 1, // 默认状态为已发布
    is_top: false, // 默认不置顶
    created_at: response.created_at,
    updated_at: response.updated_at || response.created_at,
  };
}

// ----------------------------------------------------------------------------
// Article Search
// ----------------------------------------------------------------------------

/**
 * Search articles with filters (returns Elasticsearch Hit structure)
 */
export async function searchArticles(
  params: ArticleSearchParams,
): Promise<{ list: Hit<ArticleSource>[]; total: number }> {
  const query = new URLSearchParams();
  if (params.query) query.append("query", params.query);
  if (params.category) query.append("category", params.category);
  if (params.tag) query.append("tag", params.tag);
  if (params.sort) query.append("sort", params.sort);
  // Order is required by backend, default to 'desc' for latest first
  query.append("order", params.order || "desc");
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());

  return get<{ list: Hit<ArticleSource>[]; total: number }>(
    `/article/search?${query.toString()}`,
  );
}

// ----------------------------------------------------------------------------
// Categories and Tags
// ----------------------------------------------------------------------------

/**
 * Get article categories
 */
export async function getCategoryStats(): Promise<CategoryStat[]> {
  // Backend returns {category, number} but frontend expects {name, count}
  const response =
    await get<Array<{ category: string; number: number }>>("/article/category");
  return response.map((item) => ({
    name: item.category,
    count: item.number,
  }));
}

/**
 * Get article tags
 */
export async function getTagStats(): Promise<TagStat[]> {
  // Backend returns {tag, number} but frontend expects {name, count}
  const response =
    await get<Array<{ tag: string; number: number }>>("/article/tags");
  return response.map((item) => ({
    name: item.tag,
    count: item.number,
  }));
}

// ----------------------------------------------------------------------------
// Article Interactions
// ----------------------------------------------------------------------------

/**
 * Like article
 */
export async function likeArticle(articleId: string): Promise<void> {
  return post<void>("/article/like", { article_id: articleId });
}

/**
 * Check if current user has liked an article
 */
export async function checkIsLiked(articleId: string): Promise<boolean> {
  const result = await get<{ is_liked: boolean }>(
    `/article/isLike?article_id=${articleId}`,
  );
  return result.is_liked;
}

/**
 * Get article list (for admin dashboard)
 */
export async function getArticleList(params: {
  page?: number;
  page_size?: number;
  query?: string;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<PaginatedResponse<ArticleListItem>> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.query) query.append("query", params.query);
  // Default sort by created_at (latest first)
  query.append("sort", params.sort || "created_at");
  // Order is required by backend, default to 'desc' for latest first
  query.append("order", params.order || "desc");

  // Use search endpoint since it returns the proper structure
  const response = await get<{ list: Hit<ArticleSource>[]; total: number }>(
    `/article/search?${query.toString()}`,
  );

  // Transform Hit<ArticleSource> to ArticleListItem
  const listItems: ArticleListItem[] = response.list.map((hit) => ({
    id: hit._id,
    cover: hit._source.cover,
    title: hit._source.title,
    category: hit._source.category,
    tags: hit._source.tags,
    abstract: hit._source.abstract,
    author: undefined, // Backend doesn't return author info in search
    view_count: hit._source.views,
    like_count: hit._source.likes,
    comment_count: hit._source.comments,
    created_at: hit._source.created_at,
  }));

  return {
    list: listItems,
    total: response.total,
    page: params.page || 1,
    page_size: params.page_size || 10,
  };
}
