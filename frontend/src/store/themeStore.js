import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES } from '@constants/theme';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (themeName) => {
        set({ theme: themeName });
        // Apply theme to document
        const theme = THEMES[themeName];
        if (theme) {
          const root = document.documentElement;
          Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
          });
          
          // Toggle dark class for CSS variables
          if (themeName === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },
      
      // Theme-specific utilities
      applyThemeClass: () => {
        const { theme } = get();
        const root = document.documentElement;
        root.className = `theme-${theme}`;
      },
      
      loadTheme: () => {
        const { theme } = get();
        const storedTheme = localStorage.getItem('theme-preference');
        const preference = storedTheme || theme;
        get().setTheme(preference);
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

