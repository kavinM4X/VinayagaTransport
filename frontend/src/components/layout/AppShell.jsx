import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '@store/appStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const AppShell = ({ children }) => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#339933',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#339933',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Layout Structure */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Navbar />

        {/* Main Content Area */}
        <div className="flex-1 flex relative">
          {/* Sidebar - mobile (toggle) */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed lg:hidden inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <Sidebar />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Sidebar - desktop (always visible) */}
          <aside className="hidden lg:block relative z-10 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <Sidebar />
          </aside>

          {/* Overlay for mobile */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-25 lg:hidden z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Page Content */}
          <main className="flex-1 relative">
            <div className="min-h-screen">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="p-6 lg:p-8"
              >
                {children}
              </motion.div>
            </div>
            
            {/* Footer */}
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;

