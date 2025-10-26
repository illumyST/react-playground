import { type ButtonHTMLAttributes, type Ref } from 'react';
import { cn } from '@/utils/classnames';
import { buttonVariants } from '@/design/theme-utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: buttonVariants.primary,
  secondary: buttonVariants.secondary,
  outline: buttonVariants.outline,
};

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ref,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      className={cn(
        variantStyles[variant],
        sizeStyles[size],
        loading && 'relative',
        loading && 'aria-busy:opacity-70',
        className
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span className="absolute inset-y-0 left-2 flex items-center">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[--color-on-primary]/40 border-t-[--color-on-primary]"></span>
        </span>
      )}
      <span className={cn(loading && 'opacity-0')}>{children}</span>
    </button>
  );
};
