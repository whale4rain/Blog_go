// ============================================================================
// Comment, Image, Base, and Other API Functions
// ============================================================================

import type {
  Advertisement,
  CaptchaResponse,
  Comment,
  CreateCommentRequest,
  CreateFeedbackRequest,
  CreateFriendLinkRequest,
  Feedback,
  FriendLink,
  Image,
  PaginatedResponse,
  ReplyFeedbackRequest,
  UploadImageResponse,
} from "@/types";
import { del, get, post, put, upload } from "./client";
import { USE_MOCK_API, mockApi } from "./mock/index";

// ----------------------------------------------------------------------------
// Comment API
// ----------------------------------------------------------------------------

/**
 * Create a new comment
 */
export async function createComment(
  data: CreateCommentRequest,
): Promise<Comment> {
  if (USE_MOCK_API) {
    return mockApi.createComment(data);
  }
  return post<Comment>("/comment/create", data);
}

/**
 * Delete comments by IDs
 */
export async function deleteComments(ids: number[]): Promise<void> {
  return del<void>("/comment/delete", {
    data: { ids },
  });
}

/**
 * Get comments for an article
 */
export async function getCommentList(params: {
  article_id: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Comment>> {
  if (USE_MOCK_API) {
    return mockApi.getCommentList(params);
  }

  // Backend route: GET /comment/:article_id
  return get<PaginatedResponse<Comment>>(`/comment/${params.article_id}`);
}

// ----------------------------------------------------------------------------
// Image API
// ----------------------------------------------------------------------------

/**
 * Upload an image
 */
export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("image", file); // 后端接收的字段名是 "image"

  return upload<UploadImageResponse>("/image/upload", formData, onProgress);
}

/**
 * Delete images by IDs
 */
export async function deleteImages(ids: number[]): Promise<void> {
  return del<void>("/image/delete", {
    data: { ids },
  });
}

/**
 * Get image list
 */
export async function getImageList(params: {
  name?: string;
  category?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Image>> {
  const query = new URLSearchParams();
  if (params.name) query.append("name", params.name);
  if (params.category) query.append("category", params.category);
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());

  return get<PaginatedResponse<Image>>(`/image/list?${query.toString()}`);
}

// ----------------------------------------------------------------------------
// Base API (Captcha, Verification)
// ----------------------------------------------------------------------------

/**
 * Get captcha for login/registration
 */
export async function getCaptcha(): Promise<CaptchaResponse> {
  return post<CaptchaResponse>("/base/captcha");
}

/**
 * Send email verification code
 */
export async function sendEmailVerificationCode(data: {
  email: string;
  captcha: string;
  captcha_id: string;
}): Promise<void> {
  return post<void>("/base/sendEmailVerificationCode", data);
}

/**
 * Get QQ login URL
 */
export async function getQQLoginURL(): Promise<string> {
  return get<string>("/base/qqLoginURL");
}

// ----------------------------------------------------------------------------
// Friend Link API
// ----------------------------------------------------------------------------

/**
 * Create a friend link
 */
export async function createFriendLink(
  data: CreateFriendLinkRequest,
): Promise<FriendLink> {
  return post<FriendLink>("/friendLink/create", data);
}

/**
 * Update a friend link
 */
export async function updateFriendLink(data: FriendLink): Promise<FriendLink> {
  return put<FriendLink>("/friendLink/update", data);
}

/**
 * Delete friend links by IDs
 */
export async function deleteFriendLinks(ids: number[]): Promise<void> {
  return del<void>("/friendLink/delete", {
    data: { ids },
  });
}

/**
 * Get friend link list
 */
export async function getFriendLinkList(params?: {
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<FriendLink>> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.page_size) query.append("page_size", params.page_size.toString());

  return get<PaginatedResponse<FriendLink>>(
    `/friendLink/list?${query.toString()}`,
  );
}

/**
 * Get friend links info (public)
 */
export async function getFooterFriendLinks(): Promise<FriendLink[]> {
  return get<FriendLink[]>("/friendLink/info");
}

// ----------------------------------------------------------------------------
// Feedback API
// ----------------------------------------------------------------------------

/**
 * Create feedback
 */
export async function createFeedback(
  data: CreateFeedbackRequest,
): Promise<Feedback> {
  return post<Feedback>("/feedback/create", data);
}

/**
 * Reply to feedback (Admin)
 */
export async function replyFeedback(
  data: ReplyFeedbackRequest,
): Promise<Feedback> {
  return put<Feedback>("/feedback/reply", data);
}

/**
 * Get feedback list
 */
export async function getFeedbackList(params?: {
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Feedback>> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.page_size) query.append("page_size", params.page_size.toString());

  return get<PaginatedResponse<Feedback>>(`/feedback/list?${query.toString()}`);
}

// ----------------------------------------------------------------------------
// Advertisement API
// ----------------------------------------------------------------------------

/**
 * Create advertisement
 */
export async function createAdvertisement(
  data: Partial<Advertisement>,
): Promise<Advertisement> {
  return post<Advertisement>("/advertisement/create", data);
}

/**
 * Update advertisement
 */
export async function updateAdvertisement(
  data: Advertisement,
): Promise<Advertisement> {
  return put<Advertisement>("/advertisement/update", data);
}

/**
 * Delete advertisements by IDs
 */
export async function deleteAdvertisements(ids: number[]): Promise<void> {
  return del<void>("/advertisement/delete", {
    data: { ids },
  });
}

/**
 * Get advertisement list
 */
export async function getAdvertisementList(params?: {
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Advertisement>> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.page_size) query.append("page_size", params.page_size.toString());

  return get<PaginatedResponse<Advertisement>>(
    `/advertisement/list?${query.toString()}`,
  );
}

// ----------------------------------------------------------------------------
// Website Info API
// ----------------------------------------------------------------------------

/**
 * Get website information
 */
export async function getWebsiteInfo(): Promise<Record<string, unknown>> {
  return get<Record<string, unknown>>("/website/info");
}

/**
 * Get website logo
 */
export async function getWebsiteLogo(): Promise<{ logo: string }> {
  return get<{ logo: string }>("/website/logo");
}

/**
 * Get website title
 */
export async function getWebsiteTitle(): Promise<{ title: string }> {
  return get<{ title: string }>("/website/title");
}

/**
 * Get website carousel
 */
export async function getWebsiteCarousel(): Promise<any[]> {
  return get<any[]>("/website/carousel");
}

/**
 * Get website news
 */
export async function getWebsiteNews(): Promise<any[]> {
  return get<any[]>("/website/news");
}

/**
 * Get website footer links
 */
export async function getWebsiteFooterLinks(): Promise<any[]> {
  return get<any[]>("/website/footerLink");
}
