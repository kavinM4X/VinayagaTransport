import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRouter from '@router';
import AppShell from '@components/layout/AppShell';
import { ThemeProvider } from '@components/providers/ThemeProvider';
import { useThemeStore } from '@store/themeStore';
import { useAppStore } from '@store/appStore';
import './styles/index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { theme, loadTheme } = useThemeStore();
  const { loadPreferences } = useAppStore();

  useEffect(() => {
    loadTheme();
    loadPreferences();
  }, [loadTheme, loadPreferences]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider>
          <AppRouter />
          <Toaster position="top-right" />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
