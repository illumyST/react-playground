import { cn } from '@/utils/classnames';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ className, children }: CardProps): React.ReactNode => (
  <div className={cn('rounded-lg border border-outline-2 bg-surface-1 p-xl shadow-sm', className)}>
    {children}
  </div>
);

interface AlertProps {
  status: 'error' | 'warning';
  children: React.ReactNode;
}

const alertClassByStatus = {
  error: 'border-red-300 bg-red-100 text-red-800',
  warning: 'border-orange-300 bg-orange-100 text-orange-800',
} as const;

export const Alert = ({ status, children }: AlertProps): React.ReactNode => (
  <div
    role="alert"
    className={cn('rounded-md border px-lg py-md text-sm', alertClassByStatus[status])}
  >
    {children}
  </div>
);

export const Skeleton = ({ className }: { className?: string }): React.ReactNode => (
  <div className={cn('shimmer-bg animate-pulse rounded-md', className)} />
);
