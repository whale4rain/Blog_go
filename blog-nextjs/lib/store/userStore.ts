// ============================================================================
// User Store - Zustand State Management
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserInfo } from '@/types';
import { storage } from '@/lib/utils';

// ----------------------------------------------------------------------------
// Store Types
// ----------------------------------------------------------------------------

interface UserState {
  // State
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initializeUser: () => void;
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

      // Set user
      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
          isAdmin: user?.role === 'admin',
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
          isAdmin: user.role === 'admin',
        });

        // Store token in localStorage
        storage.set('access_token', access_token);
        storage.set('user', JSON.stringify(user));
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          isAdmin: false,
        });

        // Clear storage
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
              isAdmin: user.role === 'admin',
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
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
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
