import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings,
  BarChart3,
  Calendar,
  Users,
  Truck,
  Clock,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@store/appStore';

const Sidebar = () => {
  const { setSidebarOpen, sidebarCollapsed, toggleSidebarCollapsed } = useAppStore();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Parties',
      href: '/parties',
      icon: Users,
      badge: null,
    },
    {
      name: 'Parties Weight',
      href: '/parties/weight',
      icon: Truck,
      badge: null,
    },
    {
      name: 'Batches',
      href: '/batches',
      icon: Truck,
      badge: 'New',
    },
    {
      name: 'Statistics',
      href: '/statistics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Reminders',
      href: '/reminders',
      icon: Clock,
      badge: '3',
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      badge: null,
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      badge: null,
    },
  ];

  const settingsItems = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <div className={`h-full flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebarCollapsed}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:inline-flex"
              title={sidebarCollapsed ? 'Expand' : 'Collapse'}
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`flex-1 p-4 space-y-2 ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
      >
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  to={item.href}
                  className={`
                    group flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow-sm' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700/50'
                    }
                  `}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                  }`} />
                  {!sidebarCollapsed && <span>{item.name}</span>}

                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`ml-auto px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 ${sidebarCollapsed ? 'hidden' : 'inline-flex'}`}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.nav>

      {/* Settings Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 pt-0"
      >
        <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-700">
          {settingsItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  to={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700/50'
                    }
                  `}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                  }`} />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Transport Management Pro
          <br />
          Version 2.0.0
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;

