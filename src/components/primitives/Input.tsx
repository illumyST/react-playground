import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';

const inputVariants = cva(
  'block w-full rounded-md border border-outline bg-surface-1 px-md py-sm text-base text-on-surface transition-colors placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      inputSize: {
        small: 'px-sm py-xs text-sm',
        medium: 'px-md py-sm text-base',
        large: 'px-lg py-md text-lg',
      },
    },
    defaultVariants: {
      inputSize: 'medium',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ inputSize, className }))}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
