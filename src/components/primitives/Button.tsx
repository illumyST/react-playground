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
        cube: '',
        product: '',
      },
      size: {
        small: 'h-8 px-3 text-sm',
        medium: 'h-10 px-4 text-base',
        large: 'h-12 px-6 text-lg',
      },
    },
    compoundVariants: [
      {
        variant: 'filled',
        color: 'cube',
        className: 'bg-cube-600 text-white hover:bg-cube-700',
      },
      {
        variant: 'filled',
        color: 'product',
        className: 'bg-product-600 text-white hover:bg-product-700',
      },
      {
        variant: 'outlined',
        color: 'cube',
        className: 'border-cube-600 text-cube-600 hover:bg-cube-50',
      },
      {
        variant: 'outlined',
        color: 'product',
        className: 'border-product-600 text-product-600 hover:bg-product-50',
      },
      {
        variant: 'ghost',
        color: 'cube',
        className: 'text-cube-600 hover:bg-cube-600',
      },
      {
        variant: 'ghost',
        color: 'product',
        className: 'text-product-600 hover:bg-product-600',
      },
      {
        variant: 'text',
        color: 'cube',
        className: 'text-cube-600',
      },
      {
        variant: 'text',
        color: 'product',
        className: 'text-product-600',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      color: 'cube',
      size: 'medium',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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