import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarOpen: false,
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Loading states
      loading: false,
      setLoading: (loading) => set({ loading }),
      
      // Error states
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Success states
      success: null,
      setSuccess: (success) => set({ success }),
      clearSuccess: () => set({ success: null }),
      
      // Search and filter state
      searchQuery: '',
      filters: {},
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilters: (filters) => set({ filters }),
      clearFilters: () => set({ filters: {}, searchQuery: '' }),
      
      // User preferences
      preferences: {
        tableDensity: 'comfortable',
        defaultPage: '/',
        dateFormat: 'MMM dd, yyyy',
        itemsPerPage: 20,
        compactMode: false,
      },
      updatePreferences: (newPrefs) => set((state) => ({
        preferences: { ...state.preferences, ...newPrefs }
      })),
      loadPreferences: () => {
        // Load preferences from localStorage if they exist
        const stored = localStorage.getItem('app-storage');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.state?.preferences) {
              set({ preferences: parsed.state.preferences });
            }
          } catch (error) {
            console.warn('Failed to load preferences from localStorage:', error);
          }
        }
      },
      
      // Current page state
      currentPage: '/',
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // Modal states
      modals: {
        confirm: { open: false, content: null, onConfirm: null },
        alert: { open: false, content: null },
      },
      openModal: (type, content, onConfirm = null) => set((state) => ({
        modals: {
          ...state.modals,
          [type]: { open: true, content, onConfirm },
        },
      })),
      closeModal: (type) => set((state) => ({
        modals: {
          ...state.modals,
          [type]: { open: false, content: null, onConfirm: null },
        },
      })),
      
      // Notification queue
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, {
          ...notification,
          id: Date.now() + Math.random(),
          timestamp: new Date(),
        }],
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        sidebarCollapsed: state.sidebarCollapsed,
        // Don't persist sidebar state, loading states, etc.
      }),
    }
  )
);

