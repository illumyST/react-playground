import { cn } from '@/utils/classnames';

type Status = 'ready' | 'demo' | 'watch' | 'offline';

interface StatusPillProps {
  status: Status;
}

const classByStatus: Record<Status, string> = {
  ready: 'bg-green-100 text-green-800',
  demo: 'bg-orange-100 text-orange-800',
  watch: 'bg-orange-100 text-orange-800',
  offline: 'bg-red-100 text-red-800',
};

const labelByStatus: Record<Status, string> = {
  ready: 'Ready',
  demo: 'Demo',
  watch: 'Watch',
  offline: 'Offline',
};

const StatusPill = ({ status }: StatusPillProps): React.ReactNode => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-sm py-[2px] text-xs font-bold uppercase',
      classByStatus[status],
    )}
  >
    {labelByStatus[status]}
  </span>
);

export default StatusPill;
