// ============================================================================
// User API Functions (Fixed for Cookie-based Refresh Token)
// ============================================================================

import { get, post, put, clearAuth } from "./client";
import { USE_MOCK_API, mockApi } from "./mock/index";
import type {
  User,
  UserInfo,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  UserChartData,
  PaginatedResponse,
} from "@/types";

// Re-export sendEmailVerificationCode from base API
export { sendEmailVerificationCode } from "./base";

// ----------------------------------------------------------------------------
// Authentication
// ----------------------------------------------------------------------------

/**
 * User login
 */
export async function login(data: LoginRequest): Promise<UserInfo> {
  if (USE_MOCK_API) {
    return mockApi.login(data);
  }
  return post<UserInfo>("/user/login", data);
}

/**
 * User registration
 */
export async function register(data: RegisterRequest): Promise<UserInfo> {
  if (USE_MOCK_API) {
    return mockApi.register(data);
  }
  return post<UserInfo>("/user/register", data);
}

/**
 * User logout
 * Note: This will clear the refresh token cookie on backend
 */
export async function logout(): Promise<void> {
  try {
    if (USE_MOCK_API) {
      await mockApi.logout();
    } else {
      // Call backend logout API to clear refresh token cookie
      await post<void>("/user/logout");
    }
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue with local cleanup even if API fails
  } finally {
    // Always clear local authentication data
    clearAuth();
  }
}

/**
 * Forgot password
 */
export async function forgotPassword(data: {
  email: string;
  verification_code: string;
  new_password: string;
}): Promise<void> {
  return post<void>("/user/forgotPassword", data);
}

/**
 * Reset password
 */
export async function resetPassword(data: {
  password: string;
  new_password: string;
}): Promise<void> {
  return put<void>("/user/resetPassword", data);
}

/**
 * Refresh access token
 * Note: refresh_token should be read from HTTP-only cookie
 */
export async function refreshToken(data: {
  refresh_token: string;
}): Promise<{ access_token: string }> {
  return post<{ access_token: string }>("/user/refreshToken", data);
}

// ----------------------------------------------------------------------------
// User Information
// ----------------------------------------------------------------------------

/**
 * Get user info
 */
export async function getUserInfo(): Promise<UserInfo> {
  if (USE_MOCK_API) {
    return mockApi.getUserInfo();
  }
  return get<UserInfo>("/user/info");
}

/**
 * Update user info
 */
export async function updateUserInfo(data: UpdateUserRequest): Promise<User> {
  return put<User>("/user/changeInfo", data);
}

/**
 * Get user card info by UUID
 */
export async function getUserCard(uuid: string): Promise<User> {
  if (USE_MOCK_API) {
    return mockApi.getUserCard(uuid);
  }
  return get<User>(`/user/card?uuid=${uuid}`);
}

/**
 * Get user weather info
 */
export async function getUserWeather(): Promise<any> {
  return get<any>("/user/weather");
}

/**
 * Get user activity chart data
 */
export async function getUserChart(days: number = 7): Promise<UserChartData> {
  return get<UserChartData>(`/user/chart?date=${days}`);
}

// ----------------------------------------------------------------------------
// User Management (Admin)
// ----------------------------------------------------------------------------

/**
 * Get user list (Admin)
 */
export async function getUserList(params: {
  uuid?: string;
  register?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<User>> {
  const query = new URLSearchParams();
  if (params.uuid) query.append("uuid", params.uuid);
  if (params.register) query.append("register", params.register);
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());

  return get<PaginatedResponse<User>>(`/user/list?${query.toString()}`);
}

/**
 * Freeze user (Admin)
 */
export async function freezeUser(id: number): Promise<void> {
  return put<void>("/user/freeze", { id });
}

/**
 * Unfreeze user (Admin)
 */
export async function unfreezeUser(id: number): Promise<void> {
  return put<void>("/user/unfreeze", { id });
}

/**
 * Get login logs (Admin)
 */
export async function getLoginLogs(params: {
  uuid?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<any>> {
  const query = new URLSearchParams();
  if (params.uuid) query.append("uuid", params.uuid);
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());

  return get<PaginatedResponse<any>>(`/user/loginList?${query.toString()}`);
}
