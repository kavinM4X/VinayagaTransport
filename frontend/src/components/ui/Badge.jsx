import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils';
import { X } from 'lucide-react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  className,
  animated = true,
  ...props
}) => {
  const baseClasses = [
    'badge',
    'inline-flex items-center font-medium border transition-all duration-200'
  ];

  const variantClasses = {
    default: [
      'bg-gray-100 text-gray-800 border-gray-200',
      'hover:bg-gray-200'
    ],
    primary: [
      'bg-primary-100 text-primary-800 border-primary-200',
      'hover:bg-primary-200'
    ],
    success: [
      'bg-success-100 text-success-800 border-success-200',
      'hover:bg-success-200'
    ],
    warning: [
      'bg-warning-100 text-warning-800 border-warning-200',
      'hover:bg-warning-200'
    ],
    error: [
      'bg-error-100 text-error-800 border-error-200',
      'hover:bg-error-200'
    ],
    orange: [
      'bg-orange-100 text-orange-800 border-orange-200',
      'hover:bg-orange-200'
    ],
    outline: [
      'bg-transparent text-gray-600 border-gray-300',
      'hover:bg-gray-50'
    ],
    solid: [
      'bg-gray-600 text-white border-gray-600',
      'hover:bg-gray-700'
    ]
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs rounded-md',
    md: 'px-3 py-1 text-sm rounded-lg',
    lg: 'px-4 py-1.5 text-base rounded-lg'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    removable && 'pr-2',
    className
  );

  const content = (
    <>
      <span>{children}</span>
      {removable && (
        <motion.button
          className="ml-1 inline-flex items-center justify-center w-4 h-4 text-current hover:bg-black/10 rounded-full"
          onClick={onRemove}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </>
  );

  if (!animated) {
    return (
      <span className={classes} {...props}>
        {content}
      </span>
    );
  }

  return (
    <motion.span
      className={classes}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
      {...props}
    >
      {content}
    </motion.span>
  );
};

// Specialized badge variants
export const StatusBadge = ({ status, children, ...props }) => {
  const statusVariants = {
    active: 'success',
    inactive: 'gray',
    pending: 'warning',
    completed: 'success',
    failed: 'error',
    cancelled: 'gray',
    draft: 'outline',
    published: 'primary'
  };

  return (
    <Badge variant={statusVariants[status] || 'default'} {...props}>
      {children || status}
    </Badge>
  );
};

export const PriorityBadge = ({ priority, children, ...props }) => {
  const priorityVariants = {
    high: 'error',
    medium: 'warning',
    low: 'success',
    critical: 'error',
    normal: 'gray'
  };

  return (
    <Badge variant={priorityVariants[priority] || 'default'} {...props}>
      {children || priority}
    </Badge>
  );
};

export const CategoryBadge = ({ category, children, ...props }) => {
  const categoryVariants = {
    transport: 'primary',
    batch: 'success',
    reminder: 'warning',
    party: 'orange',
    logistics: 'primary'
  };

  return (
    <Badge variant={categoryVariants[category] || 'default'} {...props}>
      {children || category}
    </Badge>
  );
};

export default Badge;

