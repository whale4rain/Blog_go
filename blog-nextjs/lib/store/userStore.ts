// ============================================================================
// User Store - Zustand State Management (Fixed Version)
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
// Store Types
// ----------------------------------------------------------------------------

interface UserState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  clearTokens: () => void;
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
        refreshToken: null,
        isLoggedIn: false,
        isAdmin: false,
        isLoading: false,
        isInitialized: false,

        // Login action
        login: (userInfo: UserInfo) => {
          const { user, access_token, refresh_token } = userInfo;

          set({
            user,
            token: access_token,
            refreshToken: refresh_token || null,
            isLoggedIn: true,
            isAdmin: user.role === "admin",
            isInitialized: true,
          });
        },

        // Logout action
        logout: () => {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isLoggedIn: false,
            isAdmin: false,
            isInitialized: true,
          });
        },

        // Update user info
        updateUser: (updates: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...updates };
            set({ user: updatedUser });
          }
        },

        // Set tokens
        setTokens: (accessToken: string, refreshToken?: string) => {
          set({
            token: accessToken,
            refreshToken: refreshToken || null,
          });
        },

        // Clear tokens
        clearTokens: () => {
          set({
            token: null,
            refreshToken: null,
          });
        },

        // Initialize authentication state
        initialize: () => {
          const state = get();

          // If not initialized and we have user data, validate it
          if (!state.isInitialized && state.user && state.token) {
            // Check if stored data is valid
            if (state.token && state.user) {
              set({
                isLoggedIn: true,
                isAdmin: state.user.role === "admin",
                isInitialized: true,
              });
            } else {
              // Invalid stored data, clear it
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
          return !!(user && token);
        },
      }),
      {
        name: "user-auth-storage",
        storage: createJSONStorage(() => customStorage),
        // Only persist essential data
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
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
            state.isLoggedIn = true;
            state.isAdmin = state.user.role === "admin";
          } else {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isLoggedIn = false;
            state.isAdmin = false;
          }
        },
        version: 1,
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
export const selectRefreshToken = (state: UserState) => state.refreshToken;
export const selectIsInitialized = (state: UserState) => state.isInitialized;
export const selectAuthState = (state: UserState) => ({
  user: state.user,
  token: state.token,
  refreshToken: state.refreshToken,
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
      authState.isLoggedIn && !!authState.user && !!authState.token,
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
