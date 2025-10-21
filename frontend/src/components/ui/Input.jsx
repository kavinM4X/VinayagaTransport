import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  containerClassName,
  type = 'text',
  variant = 'default',
  size = 'md',
  placeholder,
  disabled = false,
  required = false,
  helpText,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = [
    'input',
    'w-full bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    'transition-all duration-200',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
  ];

  const variantClasses = {
    default: 'border-gray-300 focus:border-primary-500',
    error: 'border-error-300 focus:border-error-500 focus:ring-error-500',
    success: 'border-success-300 focus:border-success-500 focus:ring-success-500',
    ghost: 'border-transparent bg-gray-50 focus:bg-white focus:border-primary-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-3 text-base rounded-xl',
    lg: 'px-5 py-4 text-lg rounded-xl'
  };

  const inputClasses = cn(
    baseClasses,
    variantClasses[error ? 'error' : 'default'],
    sizeClasses[size],
    leftIcon && 'pl-10',
    (rightIcon || type === 'password') && 'pr-10',
    className
  );

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className={cn(
          'label',
          error && 'text-error-700',
          disabled && 'text-gray-400'
        )}>
          {label}
          {required && (
            <span className="text-error-500 ml-1">*</span>
          )}
        </label>
      )}
      
      <div className="relative">
        <motion.input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          initial={{ scale: 1 }}
          animate={{ scale: isFocused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        
        {rightIcon && type !== 'password' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-error-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600 font-medium"
        >
          {error}
        </motion.p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

