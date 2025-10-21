import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  LogOut, 
  Bell, 
  Search, 
  Settings,
  User,
  Package
} from 'lucide-react';
import { useAppStore } from '@store/appStore';
import { useThemeStore } from '@store/themeStore';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';

const Navbar = () => {
  const { toggleSidebar, notifications } = useAppStore();
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();
  const isAuthenticated = location.pathname !== '/welcome';

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Package },
    { href: '/parties', label: 'Parties', icon: Package },
  ];

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text"
            >
              Vinagaya Transport
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-8">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-64 lg:w-72">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
                />
              </div>
            )}

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <Badge
                  variant="error"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </motion.button>

            {/* Quick Add Button */}
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:flex"
              leftIcon={<Package className="w-4 h-4" />}
            >
              Add Party
            </Button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'light' ? (
                <motion.div
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5"
                >
                  🌙
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5"
                >
                  ☀️
                </motion.div>
              )}
            </motion.button>

            {/* User Menu */}
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <User className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
