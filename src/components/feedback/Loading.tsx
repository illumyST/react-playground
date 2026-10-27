import { cn } from '@/utils/classnames';

interface LoadingProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 'h-lg w-lg border-2',
  medium: 'h-2xl w-2xl border-2',
  large: 'h-6xl w-6xl border-3',
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
