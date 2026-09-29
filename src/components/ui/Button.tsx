import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white shadow-xs',
      secondary: 'bg-white border border-stone-200/90 text-stone-800 hover:bg-stone-50/80 hover:border-stone-300 shadow-2xs',
      ghost: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80',
      soft: 'bg-stone-100 text-stone-900 hover:bg-stone-200/70',
    };

    const sizes = {
      sm: 'h-9 px-3.5 text-xs font-medium rounded-lg',
      md: 'h-11 px-5 text-sm font-medium rounded-xl',
      lg: 'h-13 px-7 text-base font-medium rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-sans tracking-tight transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
