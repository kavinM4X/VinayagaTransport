import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils';
import Card from '@components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  loading = false,
  className,
  delay = 0,
}) => {
  const trendColors = {
    positive: {
      icon: TrendingUp,
      color: 'text-success-600 dark:text-success-400',
      bgColor: 'bg-success-50 dark:bg-success-900/20',
      textColor: 'text-success-600 dark:text-success-400',
    },
    negative: {
      icon: TrendingDown,
      color: 'text-error-600 dark:text-error-400',
      bgColor: 'bg-error-50 dark:bg-error-900/20',
      textColor: 'text-error-600 dark:text-error-400',
    },
    neutral: {
      icon: null,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400',
    },
  };

  const trendConfig = trendColors[trend];
  const TrendIcon = trendConfig.icon;

  return (
    <Card
      className={cn(
        'relative overflow-hidden group hover:shadow-hard transition-all duration-300',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        className="relative z-10"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {title}
            </h3>
            {change && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.2 }}
                className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1', trendConfig.bgColor)}
              >
                {TrendIcon && <TrendIcon className="w-3 h-3" />}
                <span className={cn('', trendConfig.textColor)}>
                  {change}
                </span>
              </motion.div>
            )}
          </div>
          
          {/* Icon */}
          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={cn(
                'p-3 rounded-xl',
                trend === 'positive' ? 'bg-success-100 dark:bg-success-900/30' : 
                trend === 'negative' ? 'bg-error-100 dark:bg-error-900/30' :
                'bg-gray-100 dark:bg-gray-800'
              )}
            >
              {React.cloneElement(icon, {
                className: cn(
                  'w-6 h-6',
                  trend === 'positive' ? 'text-success-600 dark:text-success-400' :
                  trend === 'negative' ? 'text-error-600 dark:text-error-400' :
                  'text-gray-600 dark:text-gray-400'
                )
              })}
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          )}
        </motion.div>

        {/* Background decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.4 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className={cn(
            'absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 opacity-10',
            trend === 'positive' ? 'bg-success-500' :
            trend === 'negative' ? 'bg-error-500' :
            'bg-gray-500'
          )} />
          <div className={cn(
            'absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-12 -translate-x-12 opacity-10',
            trend === 'positive' ? 'bg-success-500' :
            trend === 'negative' ? 'bg-error-500' :
            'bg-gray-500'
          )} />
        </motion.div>
      </motion.div>

      {/* Hover Effect */}
      <motion.div
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </Card>
  );
};

export default StatsCard;

