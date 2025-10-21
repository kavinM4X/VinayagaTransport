import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils';

const Card = forwardRef(({
  children,
  className,
  variant = 'default',
  hover = true,
  animated = true,
  onClick,
  ...props
}, ref) => {
  const baseClasses = [
    'card',
    'bg-white border border-gray-200 shadow-soft',
    hover && 'hover:shadow-medium hover:border-gray-300',
    'transition-all duration-300 cursor-pointer',
    onClick && 'hover:cursor-pointer'
  ];

  const variantClasses = {
    default: 'rounded-2xl p-6',
    compact: 'rounded-xl p-4',
    spacious: 'rounded-3xl p-8',
    bordered: 'rounded-xl p-6 border-2 border-gray-100',
    elevated: 'rounded-xl p-6 shadow-medium',
    flat: 'rounded-xl p-6 border-none shadow-none bg-gray-50'
  };

  const classes = cn(baseClasses, variantClasses[variant], className);

  if (!animated) {
    return (
      <div
        ref={ref}
        className={classes}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={classes}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{
        y: hover ? -4 : 0,
        transition: { duration: 0.2 }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold text-gray-900 font-display', className)}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

const CardSubtitle = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardSubtitle.displayName = 'CardSubtitle';

const CardContent = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('space-y-4', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mt-6 pt-4 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter };
export default Card;

