import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        filled: '',
        outlined: 'border-2 bg-transparent',
        ghost: 'bg-transparent hover:bg-opacity-10',
        text: 'bg-transparent underline-offset-4 hover:underline',
      },
      color: {
        primary: '',
        product: '',
      },
      size: {
        small: 'px-md py-xs min-w-[48px] text-sm',
        medium: 'px-lg py-sm text-base',
        large: 'px-2xl py-md text-lg md:min-w-[160px]',
      },
    },
    compoundVariants: [
      {
        variant: 'filled',
        color: 'primary',
        className: 'bg-steel-500 text-white hover:bg-steel-600 active:bg-steel-700',
      },
      {
        variant: 'filled',
        color: 'product',
        className: 'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700',
      },
      {
        variant: 'outlined',
        color: 'primary',
        className: 'border-steel-500 text-steel-500 hover:bg-steel-50',
      },
      {
        variant: 'outlined',
        color: 'product',
        className: 'border-rose-500 text-rose-500 hover:bg-rose-50',
      },
      {
        variant: 'ghost',
        color: 'primary',
        className: 'text-steel-500 hover:bg-steel-50',
      },
      {
        variant: 'ghost',
        color: 'product',
        className: 'text-rose-500 hover:bg-rose-50',
      },
      {
        variant: 'text',
        color: 'primary',
        className: 'text-steel-500',
      },
      {
        variant: 'text',
        color: 'product',
        className: 'text-rose-500',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      color: 'primary',
      size: 'medium',
    },
  },
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, color, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';