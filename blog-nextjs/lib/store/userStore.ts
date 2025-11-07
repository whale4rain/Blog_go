// ============================================================================
// User Store - Zustand State Management (Fixed for Cookie-based Refresh Token)
// ============================================================================

import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import type { User, UserInfo } from "@/types";

// ----------------------------------------------------------------------------
// Storage Configuration
// ----------------------------------------------------------------------------

// Custom storage that properly handles browser environment
const customStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.warn(`Failed to get item "${name}" from localStorage:`, error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn(`Failed to set item "${name}" in localStorage:`, error);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn(`Failed to remove item "${name}" from localStorage:`, error);
    }
  },
};

// ----------------------------------------------------------------------------
// Cookie Helper Functions
// ----------------------------------------------------------------------------

/**
 * Get refresh token from HTTP-only cookie
 * Note: This reads the cookie set by backend
 */
export const getRefreshTokenFromCookie = (): string | null => {
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
};

/**
 * Check if refresh token exists in cookie
 */
export const hasRefreshToken = (): boolean => {
  return getRefreshTokenFromCookie() !== null;
};

// ----------------------------------------------------------------------------
// Store Types
// ----------------------------------------------------------------------------

interface UserState {
  // State
  user: User | null;
  token: string | null; // Access token only
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setToken: (accessToken: string) => void;
  clearToken: () => void;
  initialize: () => void;
  validateAuth: () => boolean;
}

// ----------------------------------------------------------------------------
// Create Store with Proper Persistence
// ----------------------------------------------------------------------------

export const useUserStore = create<UserState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        token: null,
        isLoggedIn: false,
        isAdmin: false,
        isLoading: false,
        isInitialized: false,

        // Login action
        login: (userInfo: UserInfo) => {
          const { user, access_token } = userInfo;
          // Note: refresh_token is automatically set in HTTP-only cookie by backend
          // We don't need to store it in localStorage

          set({
            user,
            token: access_token,
            isLoggedIn: true,
            isAdmin: user.role_id === 2, // 2 = Admin role (matches backend)
            isInitialized: true,
          });

          // Also save token to localStorage for backward compatibility
          if (typeof window !== "undefined") {
            localStorage.setItem("access_token", access_token);
          }
        },

        // Logout action
        logout: () => {
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isAdmin: false,
            isInitialized: true,
          });

          // Clear localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            localStorage.removeItem("refresh_token"); // Clean up old data
          }

          // Note: Cookie will be cleared by backend on logout API call
        },

        // Update user info
        updateUser: (updates: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...updates };
            set({ user: updatedUser });
          }
        },

        // Set token (for refresh)
        setToken: (accessToken: string) => {
          set({ token: accessToken });

          // Update localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("access_token", accessToken);
          }
        },

        // Clear token
        clearToken: () => {
          set({ token: null });

          // Clear localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
          }
        },

        // Initialize authentication state
        initialize: () => {
          const state = get();

          // If not initialized and we have user data, validate it
          if (!state.isInitialized && state.user && state.token) {
            // Check if stored data is valid and refresh token exists in cookie
            const hasRefresh = hasRefreshToken();
            if (state.token && state.user && hasRefresh) {
              set({
                isLoggedIn: true,
                isAdmin: state.user.role_id === 2, // 2 = Admin role (matches backend)
                isInitialized: true,
              });
            } else {
              // Invalid stored data or no refresh token, clear it
              get().logout();
            }
          } else if (!state.isInitialized) {
            // Mark as initialized even if no user data
            set({ isInitialized: true });
          }
        },

        // Validate current authentication state
        validateAuth: () => {
          const { user, token } = get();
          const hasRefresh = hasRefreshToken();
          return !!(user && token && hasRefresh);
        },
      }),
      {
        name: "user-auth-storage",
        storage: createJSONStorage(() => customStorage),
        // Only persist essential data (NO refresh token)
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isLoggedIn: state.isLoggedIn,
          isAdmin: state.isAdmin,
        }),
        // Handle hydration errors
        onRehydrateStorage: () => (state) => {
          if (!state) return;

          // Mark as initialized after rehydration
          state.isInitialized = true;

          // Validate rehydrated data
          if (state.user && state.token) {
            // Check if refresh token exists in cookie
            const hasRefresh = hasRefreshToken();
            if (hasRefresh) {
              state.isLoggedIn = true;
              state.isAdmin = state.user.role_id === 2; // 2 = Admin role (matches backend)
            } else {
              // No refresh token, clear state
              state.user = null;
              state.token = null;
              state.isLoggedIn = false;
              state.isAdmin = false;
            }
          } else {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.isAdmin = false;
          }

          // Clean up old refresh_token from localStorage if it exists
          if (typeof window !== "undefined") {
            localStorage.removeItem("refresh_token");
          }
        },
        version: 2, // Increment version to trigger migration
        migrate: (persistedState: any, version: number) => {
          if (version === 1) {
            // Migrate from v1 to v2: remove refreshToken
            const { refreshToken, ...rest } = persistedState;
            // Clean up localStorage
            if (typeof window !== "undefined") {
              localStorage.removeItem("refresh_token");
            }
            return rest;
          }
          return persistedState;
        },
      },
    ),
  ),
);

// ----------------------------------------------------------------------------
// Selectors
// ----------------------------------------------------------------------------

export const selectUser = (state: UserState) => state.user;
export const selectIsLoggedIn = (state: UserState) => state.isLoggedIn;
export const selectIsAdmin = (state: UserState) => state.isAdmin;
export const selectToken = (state: UserState) => state.token;
export const selectIsInitialized = (state: UserState) => state.isInitialized;
export const selectAuthState = (state: UserState) => ({
  user: state.user,
  token: state.token,
  isLoggedIn: state.isLoggedIn,
  isAdmin: state.isAdmin,
  isInitialized: state.isInitialized,
});

// ----------------------------------------------------------------------------
// Hooks for better usage
// ----------------------------------------------------------------------------

/**
 * Hook to get authentication state with proper initialization check
 */
export const useAuth = () => {
  const authState = useUserStore(selectAuthState);
  const initialize = useUserStore((state) => state.initialize);
  const validateAuth = useUserStore((state) => state.validateAuth);

  // Ensure initialization on mount
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    ...authState,
    isAuthenticated:
      authState.isLoggedIn &&
      !!authState.user &&
      !!authState.token &&
      hasRefreshToken(),
    canAccessDashboard: authState.isLoggedIn && !!authState.user,
  };
};

/**
 * Hook to get user info with null checks
 */
export const useCurrentUser = () => {
  const user = useUserStore(selectUser);
  const isLoggedIn = useUserStore(selectIsLoggedIn);

  return {
    user: isLoggedIn ? user : null,
    isLoggedIn,
  };
};

/**
 * Hook for admin-only access
 */
export const useAdminAuth = () => {
  const authState = useAuth();

  return {
    ...authState,
    isAdmin: authState.isAdmin && authState.isAuthenticated,
  };
};

// For compatibility with existing code that imports React directly
import React from "react";
