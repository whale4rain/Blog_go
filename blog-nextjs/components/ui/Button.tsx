// ============================================================================
// Button Component - Google-inspired Design
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = cn(
      'inline-flex items-center justify-center',
      'font-medium transition-colors duration-normal',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none'
    );

    // Variant styles
    const variantStyles = {
      primary: cn(
        'bg-google-blue text-white',
        'hover:bg-[hsl(214,90%,48%)]',
        'focus:ring-google-blue/50',
        'active:bg-[hsl(214,90%,44%)]'
      ),
      secondary: cn(
        'bg-google-green text-white',
        'hover:bg-[hsl(142,71%,41%)]',
        'focus:ring-google-green/50',
        'active:bg-[hsl(142,71%,37%)]'
      ),
      outline: cn(
        'border-2 border-border bg-transparent text-foreground',
        'hover:bg-muted',
        'focus:ring-google-blue/50',
        'active:bg-muted/80'
      ),
      ghost: cn(
        'bg-transparent text-foreground',
        'hover:bg-muted',
        'focus:ring-google-blue/50',
        'active:bg-muted/80'
      ),
      danger: cn(
        'bg-google-red text-white',
        'hover:bg-[hsl(4,90%,54%)]',
        'focus:ring-google-red/50',
        'active:bg-[hsl(4,90%,50%)]'
      ),
    };

    // Size styles
    const sizeStyles = {
      sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
      md: 'h-10 px-4 text-base rounded-lg gap-2',
      lg: 'h-12 px-6 text-lg rounded-lg gap-2.5',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
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
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
