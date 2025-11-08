// ============================================================================
// Axios HTTP Client Configuration
// ============================================================================

import type { ApiResponse } from "@/types";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

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
    // User-Agent cannot be set from browser (Refused to set unsafe header).
    // Set User-Agent only on server side via conditional spread below.
  },
  withCredentials: true, // Enable withCredentials to send cookies cross-domain
  // Add additional configuration for server-side requests
  ...(isServer && {
    // Ensure proper DNS resolution on server
    family: 4,
    // Disable keep-alive for server requests to avoid connection pooling issues
    keepAlive: false,
    // Add User-Agent header only when running server-side
    ...(isServer ? { headers: { "User-Agent": "Next.js-Server" } } : {}),
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

client.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data, headers } = response;

    // Handle automatic token refresh
    const newAccessToken = headers["new-access-token"];
    if (newAccessToken && typeof window !== "undefined") {
      localStorage.setItem("access_token", newAccessToken);
    }

    // Check API response code (backend returns 0 for success)
    if (data.code === 0) {
      return response;
    }

    // Handle business errors
    console.error("API Error:", data.msg);
    return Promise.reject(new Error(data.msg || "Unknown error"));
  },
  (error: AxiosError<ApiResponse>) => {
    // Handle HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");

            // Only redirect if not already on login page
            if (!window.location.pathname.includes("/login")) {
              window.location.href =
                "/login?redirect=" +
                encodeURIComponent(window.location.pathname);
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

    // Temporary debug: when calling login endpoint, log request/response headers (client-side only)
    if (!isServer && url.includes("/user/login")) {
      try {
        // eslint-disable-next-line no-console
        console.debug("[API-DEBUG] login request -> response headers:", {
          requestUrl: `${API_BASE_URL}${url}`,
          requestConfig: config,
          responseHeaders: response.headers,
          setCookie: response.headers["set-cookie"] || response.headers["Set-Cookie"],
        });
      } catch (e) {
        // ignore
      }
    }

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
