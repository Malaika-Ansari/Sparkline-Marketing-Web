import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'gradient'
  | 'icon';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  href?: string;
  isExternal?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      to,
      href,
      isExternal,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-sparkline-blue text-white hover:bg-sparkline-blue-600 focus-visible:ring-sparkline-blue shadow-sm hover:shadow active:bg-sparkline-blue-700',
      secondary:
        'bg-sparkline-slate text-white hover:bg-sparkline-midnight focus-visible:ring-sparkline-slate active:bg-slate-950',
      outline:
        'border border-slate-200 bg-white text-sparkline-midnight hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-sparkline-blue active:bg-slate-100',
      ghost:
        'text-sparkline-slate hover:text-sparkline-midnight hover:bg-slate-100/70 focus-visible:ring-sparkline-blue active:bg-slate-200/60',
      gradient:
        'bg-gradient-brand text-white hover:opacity-95 shadow-md hover:shadow-lg focus-visible:ring-sparkline-purple border border-white/10 active:opacity-90',
      icon: 'p-2 text-slate-500 hover:text-sparkline-midnight hover:bg-slate-100 rounded-xl focus-visible:ring-sparkline-blue',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
    };

    const combinedClassName = cn(
      baseStyles,
      variants[variant],
      variant !== 'icon' && sizes[size],
      className
    );

    const content = (
      <>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 mr-1" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </>
    );

    const targetUrl = to || href;

    if (targetUrl) {
      if (isExternal || href) {
        return (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
          >
            {content}
          </a>
        );
      }
      return (
        <Link to={targetUrl} className={combinedClassName}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Named Component Aliases
export const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<ButtonProps> = (props) => (
  <Button variant="outline" {...props} />
);

export const GhostButton: React.FC<ButtonProps> = (props) => (
  <Button variant="ghost" {...props} />
);

export const GradientButton: React.FC<ButtonProps> = (props) => (
  <Button variant="gradient" {...props} />
);

export const IconButton: React.FC<ButtonProps & { 'aria-label': string }> = ({
  className,
  ...props
}) => <Button variant="icon" className={cn('p-2.5', className)} {...props} />;
