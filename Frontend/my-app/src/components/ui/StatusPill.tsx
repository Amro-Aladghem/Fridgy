import { cn } from '@/libs/cn';
import type { ExpiryState } from '@/types/ui';

const stateClasses: Record<ExpiryState, string> = {
  fresh: 'bg-mint text-primary-dark',
  approaching: 'bg-warn-soft text-warn',
  expired: 'bg-danger-soft text-danger',
  unknown: 'bg-ink/5 text-muted',
};

export function StatusPill({ state, label }: { state: ExpiryState; label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        stateClasses[state],
      )}
    >
      {label}
    </span>
  );
}
