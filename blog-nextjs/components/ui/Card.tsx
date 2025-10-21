// ============================================================================
// Card Component - Google-inspired Design
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = cn(
      'rounded-lg transition-all duration-normal',
      'bg-card text-card-foreground'
    );

    // Variant styles
    const variantStyles = {
      default: 'border border-border shadow-sm',
      outlined: 'border-2 border-border',
      elevated: 'shadow-md',
    };

    // Padding styles
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Hover styles
    const hoverStyles = hoverable
      ? 'hover:shadow-lg hover:border-google-blue/20 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ----------------------------------------------------------------------------
// Card Header Component
// ----------------------------------------------------------------------------

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-4', className)} {...props}>
        {title && (
          <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ----------------------------------------------------------------------------
// Card Content Component
// ----------------------------------------------------------------------------

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('', className)} {...props} />;
});

CardContent.displayName = 'CardContent';

// ----------------------------------------------------------------------------
// Card Footer Component
// ----------------------------------------------------------------------------

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-3 mt-6 pt-4 border-t border-border', className)}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export default Card;
