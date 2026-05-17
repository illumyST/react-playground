import { cn } from '@/utils/classnames';

interface LoadingProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 'h-4 w-4 border-2',
  medium: 'h-6 w-6 border-2',
  large: 'h-10 w-10 border-3',
} as const;

export const Loading = ({ className, size = 'medium' }: LoadingProps): React.ReactNode => (
  <div className={cn('flex items-center justify-center', className)}>
    <span
      className={cn(
        'animate-spin rounded-full border-steel-500 border-t-transparent',
        sizeMap[size],
      )}
    />
  </div>
);

Loading.displayName = 'Loading';
