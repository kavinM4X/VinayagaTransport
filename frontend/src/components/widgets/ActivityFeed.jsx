import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ArrowRight,
  Clock,
  User
} from 'lucide-react';
import { formatDate, getRelativeTime } from '@utils';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';

const ActivityFeed = ({ activities = [], loading = false }) => {
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
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return Plus;
      case 'update':
        return Edit;
      case 'delete':
        return Trash2;
      case 'view':
        return Eye;
      default:
        return Eye;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'success';
      case 'update':
        return 'warning';
      case 'delete':
        return 'error';
      case 'view':
        return 'primary';
      default:
        return 'gray';
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'create':
        return 'Created';
      case 'update':
        return 'Updated';
      case 'delete':
        return 'Deleted';
      case 'view':
        return 'Viewed';
      default:
        return 'Modified';
    }
  };

  // Mock activities if none provided
  const mockActivities = activities.length > 0 ? activities : [
    {
      _id: '1',
      action: 'create',
      entityId: 'party_123',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      user: { name: 'John Doe', email: 'john@example.com' },
      changes: { partyName: 'ABC Transport' }
    },
    {
      _id: '2',
      action: 'update',
      entityId: 'party_456',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      user: { name: 'Jane Smith', email: 'jane@example.com' },
      changes: { quantity: 25 }
    },
    {
      _id: '3',
      action: 'create',
      entityId: 'party_789',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      user: { name: 'Mike Johnson', email: 'mike@example.com' },
      changes: { partyName: 'XYZ Logistics' }
    },
    {
      _id: '4',
      action: 'delete',
      entityId: 'party_101',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      user: { name: 'Sarah Wilson', email: 'sarah@example.com' },
      changes: { partyName: 'Old Company' }
    },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <p className="text-sm text-gray-600 mt-1">Latest system activities</p>
            </div>
            <Badge variant="primary" size="sm">
              {displayActivities.length}
            </Badge>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3"
                >
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => {
              const ActionIcon = getActionIcon(activity.action);
              const actionColor = getActionColor(activity.action);
              const actionText = getActionText(activity.action);
              
              return (
                <motion.div
                  key={activity._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Link
                    to={`/parties/${activity.entityId}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`p-2 rounded-lg ${
                        actionColor === 'success' ? 'bg-success-50 dark:bg-success-900/20' :
                        actionColor === 'warning' ? 'bg-warning-50 dark:bg-warning-900/20' :
                        actionColor === 'error' ? 'bg-error-50 dark:bg-error-900/20' :
                        actionColor === 'primary' ? 'bg-primary-50 dark:bg-primary-900/20' :
                        'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <ActionIcon className={`w-4 h-4 ${
                        actionColor === 'success' ? 'text-success-600 dark:text-success-400' :
                        actionColor === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                        actionColor === 'error' ? 'text-error-600 dark:text-error-400' :
                        actionColor === 'primary' ? 'text-primary-600 dark:text-primary-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`} />
                    </motion.div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {actionText}
                        </span>
                        <Badge variant={actionColor} size="sm">
                          {activity.action}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{activity.user?.name || 'System User'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{getRelativeTime(activity.createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* Show changes if available */}
                      {activity.changes && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {Object.entries(activity.changes).map(([key, value]) => (
                            <span key={key}>
                              {key}: <strong>{String(value)}</strong>
                              {Object.keys(activity.changes).indexOf(key) < Object.keys(activity.changes).length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center text-gray-500 dark:text-gray-400"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm">No recent activity</p>
              <p className="text-xs text-gray-400 mt-1">Activities will appear here when users take actions</p>
            </motion.div>
          )}
        </div>
        
        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <Link
            to="/activity"
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1 group"
          >
            View all activity
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default ActivityFeed;

