// ============================================================================
// Axios HTTP Client Configuration (Fixed for Cookie-based Refresh Token)
// ============================================================================

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type { ApiResponse } from "@/types";

// ----------------------------------------------------------------------------
// Cookie Helper Functions
// ----------------------------------------------------------------------------

/**
 * Get refresh token from HTTP-only cookie
 */
function getRefreshTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "x-refresh-token") {
        return decodeURIComponent(value);
      }
    }
  } catch (error) {
    console.warn("Failed to read refresh token from cookie:", error);
  }

  return null;
}

/**
 * Check if refresh token exists
 */
function hasRefreshToken(): boolean {
  return getRefreshTokenFromCookie() !== null;
}

// ----------------------------------------------------------------------------
// Client Configuration
// ----------------------------------------------------------------------------

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080/api";
const TIMEOUT = 30000; // 30 seconds

// Determine if we're in server environment
const isServer = typeof window === "undefined";

// ----------------------------------------------------------------------------
// Create Axios Instance
// ----------------------------------------------------------------------------

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: isServer ? 10000 : TIMEOUT, // Shorter timeout on server
  headers: {
    "Content-Type": "application/json",
    ...(isServer && { "User-Agent": "Next.js-Server" as any }), // Only set User-Agent on server-side
  },
  withCredentials: true, // Enable credentials to send/receive cookies
  // Add additional configuration for server-side requests
  ...(isServer && {
    // Ensure proper DNS resolution on server
    family: 4,
    // Disable keep-alive for server requests to avoid connection pooling issues
    keepAlive: false,
  }),
});

// ----------------------------------------------------------------------------
// Request Interceptor
// ----------------------------------------------------------------------------

client.interceptors.request.use(
  (config) => {
    // Only add token for authenticated endpoints (not for public ones like captcha)
    const publicEndpoints = [
      "/user/login",
      "/user/register",
      "/base/captcha",
      "/user/sendEmailCode",
      "/base/captcha",
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.endsWith(endpoint),
    );

    // Get access token from localStorage (client-side only) for non-public endpoints
    if (typeof window !== "undefined" && !isPublicEndpoint) {
      const token = localStorage.getItem("access_token");
      if (token) {
        // Use x-access-token header to match backend expectations
        config.headers["x-access-token"] = token;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// ----------------------------------------------------------------------------
// Response Interceptor
// ----------------------------------------------------------------------------

// Flag to prevent multiple token refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // Check for new access token in response headers
    if (response.headers["new-access-token"]) {
      const newAccessToken = response.headers["new-access-token"];
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", newAccessToken);
        console.log("Access token refreshed via header");
      }
    }

    // Check API response code (backend returns 0 for success)
    if (data.code === 0) {
      return response;
    }

    // Handle business errors
    console.error("API Error:", data.msg);
    return Promise.reject(new Error(data.msg || "Unknown error"));
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - try to refresh token
          if (typeof window !== "undefined") {
            // Check if this is a retry request
            if (originalRequest._retry) {
              // Already retried, clear tokens and redirect to login
              localStorage.removeItem("access_token");
              localStorage.removeItem("user");

              // Clear user store
              const { useUserStore } = await import("@/lib/store/userStore");
              useUserStore.getState().logout();

              if (!window.location.pathname.includes("/login")) {
                window.location.href =
                  "/login?redirect=" +
                  encodeURIComponent(window.location.pathname);
              }
              return Promise.reject(error);
            }

            // Mark request as retry
            originalRequest._retry = true;

            if (isRefreshing) {
              // If already refreshing, add to queue
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  if (originalRequest.headers) {
                    originalRequest.headers["x-access-token"] = token;
                  }
                  return client(originalRequest);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            isRefreshing = true;

            try {
              // Try to refresh the token using cookie
              const refreshToken = getRefreshTokenFromCookie();

              if (!refreshToken) {
                throw new Error("No refresh token available");
              }

              // Call refresh token API
              // Backend expects refresh_token in request body
              const response = await client.post("/user/refreshToken", {
                refresh_token: refreshToken,
              });

              const newAccessToken = response.data.data.access_token;

              // Update stored token
              localStorage.setItem("access_token", newAccessToken);

              // Update user store
              const { useUserStore } = await import("@/lib/store/userStore");
              useUserStore.getState().setToken(newAccessToken);

              // Process queue
              processQueue(null, newAccessToken);

              // Update authorization header and retry original request
              if (originalRequest.headers) {
                originalRequest.headers["x-access-token"] = newAccessToken;
              }
              return client(originalRequest);
            } catch (refreshError) {
              // Refresh failed, clear everything and redirect
              processQueue(refreshError, null);
              localStorage.removeItem("access_token");
              localStorage.removeItem("user");

              // Clear user store
              const { useUserStore } = await import("@/lib/store/userStore");
              useUserStore.getState().logout();

              if (!window.location.pathname.includes("/login")) {
                window.location.href =
                  "/login?redirect=" +
                  encodeURIComponent(window.location.pathname);
              }
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }
          break;

        case 403:
          console.error(
            "Forbidden: You do not have permission to access this resource",
          );
          break;

        case 404:
          console.error("Not Found: The requested resource does not exist");
          break;

        case 500:
          console.error("Server Error: Please try again later");
          break;

        default:
          console.error(`HTTP Error ${status}:`, data?.msg || error.message);
      }

      return Promise.reject(error);
    }

    // Network error
    if (error.request) {
      console.error("Network Error: Please check your connection");
      return Promise.reject(
        new Error("Network error. Please check your connection."),
      );
    }

    // Other errors
    console.error("Request Error:", error.message);
    return Promise.reject(error);
  },
);

// ----------------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------------

/**
 * Generic GET request
 */
export async function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await client.get<ApiResponse<T>>(url, config);
    return response.data.data;
  } catch (error) {
    // Add better error logging for server-side requests
    if (isServer) {
      console.error(`Server-side API Error [GET ${url}]:`, {
        baseURL: API_BASE_URL,
        error: error instanceof Error ? error.message : "Unknown error",
        config: {
          timeout: config?.timeout,
          headers: config?.headers,
        },
      });
    }
    throw error;
  }
}

/**
 * Generic POST request
 */
export async function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await client.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  } catch (error) {
    if (isServer) {
      console.error(`Server-side API Error [POST ${url}]:`, {
        baseURL: API_BASE_URL,
        error: error instanceof Error ? error.message : "Unknown error",
        config: {
          timeout: config?.timeout,
          headers: config?.headers,
        },
      });
    }
    throw error;
  }
}

/**
 * Generic PUT request
 */
export async function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await client.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  } catch (error) {
    if (isServer) {
      console.error(`Server-side API Error [PUT ${url}]:`, {
        baseURL: API_BASE_URL,
        error: error instanceof Error ? error.message : "Unknown error",
        config: {
          timeout: config?.timeout,
          headers: config?.headers,
        },
      });
    }
    throw error;
  }
}

/**
 * Generic DELETE request
 */
export async function del<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await client.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  } catch (error) {
    if (isServer) {
      console.error(`Server-side API Error [DELETE ${url}]:`, {
        baseURL: API_BASE_URL,
        error: error instanceof Error ? error.message : "Unknown error",
        config: {
          timeout: config?.timeout,
          headers: config?.headers,
        },
      });
    }
    throw error;
  }
}

/**
 * Upload file
 * IMPORTANT: Special handling to prevent cookie issues with multipart/form-data
 */
export async function upload<T = unknown>(
  url: string,
  formData: FormData,
  onProgress?: (progress: number) => void,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    // Get access token manually for upload
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const response = await client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        // Let browser set Content-Type with boundary for multipart/form-data
        // DO NOT set Content-Type manually
        ...config?.headers,
        // Ensure token is passed
        ...(token && { "x-access-token": token }),
      },
      // CRITICAL: Enable credentials to preserve cookies during upload
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(progress);
        }
      },
    });

    // Check for new access token in response
    if (response.headers["new-access-token"]) {
      const newAccessToken = response.headers["new-access-token"];
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", newAccessToken);
        console.log("Access token refreshed during upload");
      }
    }

    return response.data.data;
  } catch (error) {
    // Handle upload-specific errors
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        // Token expired during upload, try to refresh and retry
        if (typeof window !== "undefined" && hasRefreshToken()) {
          try {
            const refreshToken = getRefreshTokenFromCookie();
            if (refreshToken) {
              const refreshResponse = await client.post("/user/refreshToken", {
                refresh_token: refreshToken,
              });
              const newAccessToken = refreshResponse.data.data.access_token;
              localStorage.setItem("access_token", newAccessToken);

              // Retry upload with new token
              return upload(url, formData, onProgress, config);
            }
          } catch (refreshError) {
            console.error(
              "Failed to refresh token during upload:",
              refreshError,
            );
            throw error;
          }
        }
      }
    }

    if (isServer) {
      console.error(`Server-side API Error [UPLOAD ${url}]:`, {
        baseURL: API_BASE_URL,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    throw error;
  }
}

/**
 * Check authentication status
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("access_token");
  const hasRefresh = hasRefreshToken();
  return !!(token && hasRefresh);
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Clear all authentication data
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("refresh_token"); // Clean up old data
}

// ============================================================================
// Export
// ============================================================================

export { client, getRefreshTokenFromCookie, hasRefreshToken };
export default client;
