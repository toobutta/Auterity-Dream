import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { COLORS } from '../../tokens/colors';
import { SIZES } from '../../tokens/spacing';

// Button variants
export const BUTTON_VARIANTS = {
  primary: {
    solid: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  },
  secondary: {
    solid: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500'
  },
  success: {
    solid: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    ghost: 'text-green-600 hover:bg-green-50 focus:ring-green-500'
  },
  error: {
    solid: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    ghost: 'text-red-600 hover:bg-red-50 focus:ring-red-500'
  },
  warning: {
    solid: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    outline: 'border border-yellow-600 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
    ghost: 'text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500'
  }
} as const;

// Button sizes
export const BUTTON_SIZES = {
  xs: {
    height: SIZES.button.xs.height,
    paddingX: SIZES.button.xs.paddingX,
    fontSize: SIZES.button.xs.fontSize,
    iconSize: 'w-3 h-3'
  },
  sm: {
    height: SIZES.button.sm.height,
    paddingX: SIZES.button.sm.paddingX,
    fontSize: SIZES.button.sm.fontSize,
    iconSize: 'w-4 h-4'
  },
  md: {
    height: SIZES.button.md.height,
    paddingX: SIZES.button.md.paddingX,
    fontSize: SIZES.button.md.fontSize,
    iconSize: 'w-5 h-5'
  },
  lg: {
    height: SIZES.button.lg.height,
    paddingX: SIZES.button.lg.paddingX,
    fontSize: SIZES.button.lg.fontSize,
    iconSize: 'w-6 h-6'
  },
  xl: {
    height: SIZES.button.xl.height,
    paddingX: SIZES.button.xl.paddingX,
    fontSize: SIZES.button.xl.fontSize,
    iconSize: 'w-7 h-7'
  }
} as const;

// Button component props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  style?: keyof typeof BUTTON_VARIANTS.primary;
  size?: keyof typeof BUTTON_SIZES;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

// Loading spinner component
const LoadingSpinner: React.FC<{ size: keyof typeof BUTTON_SIZES }> = ({ size }) => {
  const iconSize = BUTTON_SIZES[size].iconSize;
  return (
    <svg
      className={`animate-spin ${iconSize}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Button component with forwardRef for proper ref handling
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      style = 'solid',
      size = 'md',
      loading = false,
      loadingText = 'Loading...',
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      className = '',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Get variant classes
    const variantClasses = BUTTON_VARIANTS[variant][style];

    // Get size configuration
    const sizeConfig = BUTTON_SIZES[size];

    // Combine all classes
    const buttonClasses = cn(
      // Base button styles
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:transform active:scale-95',

      // Size-specific styles
      `h-${sizeConfig.height}`,
      `px-${sizeConfig.paddingX}`,
      `text-${sizeConfig.fontSize}`,

      // Variant styles
      variantClasses,

      // Full width
      fullWidth && 'w-full',

      // Loading state
      loading && 'cursor-wait',

      // Custom className
      className
    );

    // Handle click with loading prevention
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Left icon */}
        {leftIcon && !loading && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}

        {/* Loading spinner */}
        {loading && (
          <span className="mr-2 flex-shrink-0">
            <LoadingSpinner size={size} />
          </span>
        )}

        {/* Button content */}
        <span className={cn(
          'truncate',
          loading && 'opacity-75'
        )}>
          {loading ? loadingText : children}
        </span>

        {/* Right icon */}
        {rightIcon && !loading && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
