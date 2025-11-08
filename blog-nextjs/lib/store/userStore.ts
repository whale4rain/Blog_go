// ============================================================================
// User Store - Zustand State Management
// ============================================================================

import { USER_ROLES } from '@/lib/constants/roles';
import { storage } from '@/lib/utils';
import type { User, UserInfo } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ----------------------------------------------------------------------------
// Store Types
// ----------------------------------------------------------------------------

interface UserState {
  // State
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  hasHydrated: boolean; // Track if state has been rehydrated from storage

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initializeUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

// ----------------------------------------------------------------------------
// Create Store
// ----------------------------------------------------------------------------

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      isLoggedIn: false,
      isAdmin: false,
      hasHydrated: false,

      // Set hydration state
      setHasHydrated: (state) => set({ hasHydrated: state }),

      // Set user
      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
          isAdmin: user?.role_id === USER_ROLES.ADMIN,
        }),

      // Set token
      setToken: (token) => {
        set({ token });
        if (token) {
          storage.set('access_token', token);
        } else {
          storage.remove('access_token');
        }
      },

      // Login action
      login: (userInfo: UserInfo) => {
        const { user, access_token } = userInfo;

        set({
          user,
          token: access_token,
          isLoggedIn: true,
          isAdmin: user.role_id === USER_ROLES.ADMIN,
        });

        // Store token in localStorage
        storage.set('access_token', access_token);
        storage.set('user', JSON.stringify(user));
      },

      // Logout action
      logout: async () => {
        // Call backend logout API to clear refresh_token cookie and blacklist
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080/api'}/user/logout`,
            {
              method: 'POST',
              credentials: 'include', // Important: send cookies
              headers: {
                'x-access-token': storage.get('access_token') || '',
              },
            }
          );
        } catch (error) {
          console.error('Logout API error:', error);
        }

        // Clear local state and storage
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          isAdmin: false,
        });

        // Clear storage (only access_token and user, refresh_token is HttpOnly cookie)
        storage.remove('access_token');
        storage.remove('user');
      },

      // Update user info
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          storage.set('user', JSON.stringify(updatedUser));
        }
      },

      // Initialize user from storage
      initializeUser: () => {
        if (typeof window === 'undefined') return;

        const token = storage.get('access_token');
        const userStr = storage.get('user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr) as User;
            set({
              user,
              token,
              isLoggedIn: true,
              isAdmin: user.role_id === USER_ROLES.ADMIN,
            });
          } catch (error) {
            console.error('Failed to parse user from storage:', error);
            get().logout();
          }
        }
      },
    }),
    {
      name: 'user-storage',
      // Persist all state fields (user, token, isLoggedIn, isAdmin)
      // Zustand automatically excludes functions from persistence
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        isAdmin: state.isAdmin,
      }),
      // Set hasHydrated to true after rehydration completes
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// ----------------------------------------------------------------------------
// Selectors
// ----------------------------------------------------------------------------

export const selectUser = (state: UserState) => state.user;
export const selectIsLoggedIn = (state: UserState) => state.isLoggedIn;
export const selectIsAdmin = (state: UserState) => state.isAdmin;
export const selectToken = (state: UserState) => state.token;
export const selectHasHydrated = (state: UserState) => state.hasHydrated;
