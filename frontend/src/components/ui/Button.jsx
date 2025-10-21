import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  onClick,
  fullWidth = false,
  as: Component = 'button',
  ...props
}, ref) => {
  const baseClasses = [
    'btn',
    'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    fullWidth && 'w-full'
  ];

  const variantClasses = {
    primary: [
      'bg-primary-600 text-white border border-primary-600',
      'hover:bg-primary-700 hover:border-primary-700',
      'focus:ring-primary-500',
      'shadow-soft hover:shadow-medium'
    ],
    secondary: [
      'bg-gray-100 text-gray-700 border border-gray-300',
      'hover:bg-gray-200 hover:border-gray-400',
      'focus:ring-gray-500',
      'shadow-xs hover:shadow-soft'
    ],
    success: [
      'bg-success-600 text-white border border-success-600',
      'hover:bg-success-700 hover:border-success-700',
      'focus:ring-success-500',
      'shadow-soft hover:shadow-medium'
    ],
    error: [
      'bg-error-600 text-white border border-error-600',
      'hover:bg-error-700 hover:border-error-700',
      'focus:ring-error-500',
      'shadow-soft hover:shadow-medium'
    ],
    ghost: [
      'bg-transparent text-gray-600 border border-gray-200',
      'hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300',
      'focus:ring-gray-500'
    ],
    outline: [
      'bg-transparent text-primary-600 border border-primary-600',
      'hover:bg-primary-50 hover:text-primary-700',
      'focus:ring-primary-500'
    ],
    icon: [
      'p-2 bg-white border border-gray-200',
      'hover:bg-gray-50 hover:border-gray-300',
      'focus:ring-gray-500'
    ]
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
    xl: 'px-8 py-4 text-xl rounded-2xl',
    icon: 'w-10 h-10 p-0 rounded-xl'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const MotionComponent = motion(Component);
  
  return (
    <MotionComponent
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {!loading && leftIcon && (
        <span className="mr-1">{leftIcon}</span>
      )}
      
      {children && (
        <span>{children}</span>
      )}
      
      {!loading && rightIcon && (
        <span className="ml-1">{rightIcon}</span>
      )}
      
      {loading && !children && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
    </MotionComponent>
  );
});

Button.displayName = 'Button';

export default Button;

