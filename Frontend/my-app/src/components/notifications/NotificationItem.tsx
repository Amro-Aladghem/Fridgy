import { cn } from '@/libs/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatRelative } from '@/libs/format';
import {
  agentPresentation,
  statusPresentation,
} from '@/components/notifications/notificationPresentation';
import type { AppNotification } from '@/types/ui';

interface NotificationItemProps {
  notification: AppNotification;
  onSelect: (notification: AppNotification) => void;
}

export function NotificationItem({ notification, onSelect }: NotificationItemProps) {
  const { t } = useLanguage();
  const agent = agentPresentation[notification.agentType];
  const status = statusPresentation[notification.notificationStatus];
  const AgentIcon = agent.Icon;
  const StatusIcon = status.Icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={cn(
        'flex w-full gap-3 rounded-xl border p-3 text-start transition-colors hover:bg-mint/40',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        notification.isRead ? 'border-line bg-surface' : 'border-primary/20 bg-mint/30',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          agent.tint,
        )}
      >
        <AgentIcon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-ink">{notification.title}</span>
          {!notification.isRead && (
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-primary"
              aria-label={t('unread')}
            />
          )}
        </span>
        <span className="mt-0.5 block text-sm text-muted">{notification.text}</span>
        <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          <StatusIcon
            size={13}
            className={cn(status.tint, status.spin && 'animate-spin')}
            aria-hidden="true"
          />
          <span>{t(agent.labelKey)}</span>
          <span aria-hidden="true">·</span>
          <span>{formatRelative(notification.updatedAt)}</span>
        </span>
      </span>
    </button>
  );
}
