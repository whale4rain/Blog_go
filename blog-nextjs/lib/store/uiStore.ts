// ============================================================================
// UI Store - Zustand State Management for UI State
// ============================================================================

import { create } from 'zustand';

// ----------------------------------------------------------------------------
// Store Types
// ----------------------------------------------------------------------------

interface UIState {
  // Layout State
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modal State
  loginModalOpen: boolean;
  registerModalOpen: boolean;
  feedbackModalOpen: boolean;

  // Loading State
  globalLoading: boolean;

  // Theme State
  theme: 'light' | 'dark';

  // Mobile Menu
  mobileMenuOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  openLoginModal: () => void;
  closeLoginModal: () => void;

  openRegisterModal: () => void;
  closeRegisterModal: () => void;

  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;

  setGlobalLoading: (loading: boolean) => void;

  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Close all modals
  closeAllModals: () => void;
}

// ----------------------------------------------------------------------------
// Create Store
// ----------------------------------------------------------------------------

export const useUIStore = create<UIState>((set, get) => ({
  // Initial State
  sidebarOpen: true,
  sidebarCollapsed: false,
  loginModalOpen: false,
  registerModalOpen: false,
  feedbackModalOpen: false,
  globalLoading: false,
  theme: 'light',
  mobileMenuOpen: false,

  // Sidebar Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Login Modal Actions
  openLoginModal: () => set({
    loginModalOpen: true,
    registerModalOpen: false,
    mobileMenuOpen: false
  }),
  closeLoginModal: () => set({ loginModalOpen: false }),

  // Register Modal Actions
  openRegisterModal: () => set({
    registerModalOpen: true,
    loginModalOpen: false,
    mobileMenuOpen: false
  }),
  closeRegisterModal: () => set({ registerModalOpen: false }),

  // Feedback Modal Actions
  openFeedbackModal: () => set({ feedbackModalOpen: true }),
  closeFeedbackModal: () => set({ feedbackModalOpen: false }),

  // Global Loading
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  // Theme Actions
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  // Mobile Menu Actions
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Close All Modals
  closeAllModals: () => set({
    loginModalOpen: false,
    registerModalOpen: false,
    feedbackModalOpen: false,
    mobileMenuOpen: false,
  }),
}));

// ----------------------------------------------------------------------------
// Selectors
// ----------------------------------------------------------------------------

export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UIState) => state.sidebarCollapsed;
export const selectLoginModalOpen = (state: UIState) => state.loginModalOpen;
export const selectRegisterModalOpen = (state: UIState) => state.registerModalOpen;
export const selectFeedbackModalOpen = (state: UIState) => state.feedbackModalOpen;
export const selectGlobalLoading = (state: UIState) => state.globalLoading;
export const selectTheme = (state: UIState) => state.theme;
export const selectMobileMenuOpen = (state: UIState) => state.mobileMenuOpen;
