// ============================================================================
// Article API Functions
// ============================================================================

import { get, post, put, del } from "./client";
import { USE_MOCK_API, mockApi } from "./mock";
import type {
  Article,
  ArticleListItem,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleSearchParams,
  CategoryStat,
  TagStat,
  PaginatedResponse,
} from "@/types";

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
  data: UpdateArticleRequest,
): Promise<Article> {
  return put<Article>("/article/update", data);
}

/**
 * Delete articles by IDs
 */
export async function deleteArticles(ids: number[]): Promise<void> {
  return del<void>("/article/delete", {
    data: { ids },
  });
}

/**
 * Get article by ID
 */
export async function getArticleById(id: number): Promise<Article> {
  if (USE_MOCK_API) {
    return mockApi.getArticleById(id);
  }
  return get<Article>(`/article/${id}`);
}

// ----------------------------------------------------------------------------
// Article Search
// ----------------------------------------------------------------------------

/**
 * Search articles with filters
 */
export async function searchArticles(
  params: ArticleSearchParams,
): Promise<PaginatedResponse<ArticleListItem>> {
  const query = new URLSearchParams();
  if (params.query) query.append("query", params.query);
  if (params.category) query.append("category", params.category);
  if (params.tag) query.append("tag", params.tag);
  if (params.sort) query.append("sort", params.sort);
  if (params.order) query.append("order", params.order);
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());

  return get<PaginatedResponse<ArticleListItem>>(
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
  if (USE_MOCK_API) {
    return mockApi.getArticleCategory();
  }
  return get<CategoryStat[]>("/article/category");
}

/**
 * Get article tags
 */
export async function getTagStats(): Promise<TagStat[]> {
  if (USE_MOCK_API) {
    return mockApi.getArticleTags();
  }
  return get<TagStat[]>("/article/tags");
}

// ----------------------------------------------------------------------------
// Article Interactions
// ----------------------------------------------------------------------------

/**
 * Like article
 */
export async function likeArticle(articleId: number): Promise<void> {
  if (USE_MOCK_API) {
    return mockApi.articleLike(articleId);
  }
  return post<void>("/article/like", { article_id: articleId });
}

/**
 * Check if current user has liked an article
 */
export async function checkIsLiked(articleId: number): Promise<boolean> {
  if (USE_MOCK_API) {
    return mockApi.checkIsLiked(articleId);
  }
  const result = await get<{ is_liked: boolean }>(
    `/article/isLike?article_id=${articleId}`,
  );
  return result.is_liked;
}

/**
 * Get article list
 */
export async function getArticleList(params: {
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<ArticleListItem>> {
  if (USE_MOCK_API) {
    return mockApi.getArticleList(params);
  }

  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());

  return get<PaginatedResponse<ArticleListItem>>(
    `/article/list?${query.toString()}`,
  );
}
