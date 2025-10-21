import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  Download, 
  Share2, 
  Calendar,
  Users,
  Truck,
  FileText
} from 'lucide-react';
import Card from '@components/ui/Card';

const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    {
      id: 'add-party',
      title: 'Add New Party',
      description: 'Create a new transport party',
      icon: Plus,
      href: '/parties/new',
    },
    {
      id: 'upload-data',
      title: 'Import Data',
      description: 'Upload CSV or Excel files to Vinagaya Transport',
      icon: Upload,
      href: '/import',
    },
    {
      id: 'export-report',
      title: 'Export Report',
      description: 'Download analytics report',
      icon: Download,
      href: '/export',
    },
    {
      id: 'share-data',
      title: 'Share Data',
      description: 'Share parties via WhatsApp',
      icon: Share2,
      href: '#',
    },
    {
      id: 'set-reminder',
      title: 'Set Reminder',
      description: 'Schedule follow-up reminders',
      icon: Calendar,
      href: '/reminders/new',
    },
    {
      id: 'bulk-actions',
      title: 'Bulk Actions',
      description: 'Perform bulk operations',
      icon: Users,
      href: '/bulk',
    },
    {
      id: 'track-shipment',
      title: 'Track Shipment',
      description: 'Monitor shipment status',
      icon: Truck,
      href: '/tracking',
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create custom reports',
      icon: FileText,
      href: '/reports',
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const handleClick = (action) => {
    if (action.href === '#') {
      // Handle share data action
      const shareText = `Check out my transport data! View all parties and analytics at: ${window.location.origin}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // Navigate to internal routes
      navigate(action.href);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <div className="card-header">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <p className="text-sm text-gray-600 mt-1">Shortcuts to common tasks</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {actions.map((action) => {
            const Icon = action.icon;
            
            return (
              <motion.div
                key={action.id}
                variants={itemVariants}
                onClick={() => handleClick(action)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 text-left space-y-3 cursor-pointer hover:shadow-medium hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-2.5 rounded-lg transition-colors ${
                      action.id === 'add-party' 
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                
                {/* Accent line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  className={`h-0.5 rounded-full transition-colors ${
                    action.id === 'add-party' 
                      ? 'bg-primary-500' 
                      : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-primary-500'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* Powered by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Quick actions help you get more done efficiently
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default QuickActions;