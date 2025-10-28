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
  Hit,
  ArticleSource,
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
  if (USE_MOCK_API) {
    return mockApi.createArticle(data);
  }
  return post<Article>("/article/create", data);
}

/**
 * Update an existing article
 */
export async function updateArticle(
  id: string,
  data: UpdateArticleRequest,
): Promise<Article> {
  if (USE_MOCK_API) {
    return mockApi.updateArticle(id, data);
  }
  return put<Article>("/article/update", { ...data, id });
}

/**
 * Delete article by ID
 */
export async function deleteArticle(id: string): Promise<void> {
  if (USE_MOCK_API) {
    return mockApi.deleteArticle(id);
  }
  return del<void>("/article/delete", {
    data: { ids: [id] },
  });
}

/**
 * Delete articles by IDs
 */
export async function deleteArticles(ids: string[]): Promise<void> {
  if (USE_MOCK_API) {
    return mockApi.deleteArticles(ids);
  }
  return del<void>("/article/delete", {
    data: { ids },
  });
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string): Promise<Article> {
  if (USE_MOCK_API) {
    return mockApi.getArticleById(id);
  }
  return get<Article>(`/article/${id}`);
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
  // Order is required by backend, default to 'desc'
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
  if (USE_MOCK_API) {
    return mockApi.getArticleCategory();
  }
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
  if (USE_MOCK_API) {
    return mockApi.getArticleTags();
  }
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
  if (USE_MOCK_API) {
    return mockApi.articleLike(articleId);
  }
  return post<void>("/article/like", { article_id: articleId });
}

/**
 * Check if current user has liked an article
 */
export async function checkIsLiked(articleId: string): Promise<boolean> {
  if (USE_MOCK_API) {
    return mockApi.checkIsLiked(articleId);
  }
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
}): Promise<PaginatedResponse<ArticleListItem>> {
  if (USE_MOCK_API) {
    return mockApi.getArticleList(params);
  }

  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.query) query.append("query", params.query);
  // Order is required by backend, default to 'desc'
  query.append("order", "desc");

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
