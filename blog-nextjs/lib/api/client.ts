// ============================================================================
// Axios HTTP Client Configuration
// ============================================================================

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type { ApiResponse } from "@/types";

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
  withCredentials: false, // Disable withCredentials to avoid CORS issues
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
    // Get token from localStorage (client-side only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
          // Unauthorized - try to refresh token or redirect to login
          if (typeof window !== "undefined") {
            // Check if this is a retry request
            if (originalRequest._retry) {
              // Already retried, clear tokens and redirect to login
              localStorage.removeItem("access_token");
              localStorage.removeItem("user");
              localStorage.removeItem("refresh_token");

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
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  return client(originalRequest);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            isRefreshing = true;

            try {
              // Try to refresh the token
              const refreshToken = localStorage.getItem("refresh_token");
              if (refreshToken) {
                const response = await client.post("/user/refreshToken", {
                  refresh_token: refreshToken,
                });

                const { access_token } = response.data.data;

                // Update stored token
                localStorage.setItem("access_token", access_token);

                // Process queue
                processQueue(null, access_token);

                // Update authorization header and retry original request
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${access_token}`;
                }
                return client(originalRequest);
              } else {
                throw new Error("No refresh token available");
              }
            } catch (refreshError) {
              // Refresh failed, clear everything and redirect
              processQueue(refreshError, null);
              localStorage.removeItem("access_token");
              localStorage.removeItem("user");
              localStorage.removeItem("refresh_token");

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
 */
export async function upload<T = unknown>(
  url: string,
  formData: FormData,
  onProgress?: (progress: number) => void,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await client.post<ApiResponse<T>>(url, formData, {
    ...config,
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress(progress);
      }
    },
  });
  return response.data.data;
}

// ============================================================================
// Export
// ============================================================================

export { client };
export default client;
