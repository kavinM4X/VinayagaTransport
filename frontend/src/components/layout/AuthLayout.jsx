import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  Cog, 
  Smartphone, 
  Shield 
} from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Content */}
      <div className="relative flex min-h-screen">
        {/* Left Side - Welcome Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16"
        >
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text mb-4">
                Vinagaya Transport
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Professional transport management made simple and efficient.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    {React.createElement(feature.icon, { className: 'w-6 h-6 text-primary-600 dark:text-primary-400' })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col justify-center px-6 py-16 lg:px-12"
        >
          <div className="max-w-md mx-auto w-full">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8 flex justify-start lg:hidden"
            >
              <Link
                to="/welcome"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Welcome
              </Link>
            </motion.div>

            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0, rotationY: 15 }}
              animate={{ opacity: 1, rotationY: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card"
            >
              {children}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              © {new Date().getFullYear()} Vinagaya Transport. All rights reserved.
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const features = [
  {
    title: 'Smart Analytics',
    description: 'Track performance with detailed insights and reporting.',
    icon: BarChart3
  },
  {
    title: 'Easy Management',
    description: 'Streamline operations with intuitive tools.',
    icon: Cog
  },
  {
    title: 'Mobile Ready',
    description: 'Access your data anywhere, anytime.',
    icon: Smartphone
  },
  {
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and reliability.',
    icon: Shield
  },
];

export default AuthLayout;
