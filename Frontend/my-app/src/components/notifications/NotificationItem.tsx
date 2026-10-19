import { cn } from '@/libs/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatRelative } from '@/libs/format';
import {
  agentPresentation,
  statusLabelKey,
  statusPresentation,
} from '@/components/notifications/notificationPresentation';
import type { NotificationDto } from '@/types/notification';
import type { NotificationStatus } from '@/types/enums';

interface NotificationItemProps {
  notification: NotificationDto;
  isLast: boolean;
}

export function NotificationItem({ notification, isLast }: NotificationItemProps) {
  const { t } = useLanguage();
  const agent = agentPresentation[notification.agentType];
  const presentedStatus: NotificationStatus =
    notification.notificationStatus === 'Running' && !isLast
      ? 'Completed'
      : notification.notificationStatus;
  const status = statusPresentation[presentedStatus];
  const AgentIcon = agent.Icon;
  const StatusIcon = status.Icon;

  return (
    <div className="flex w-full gap-3 rounded-xl border border-line bg-surface p-3">
      <span
        className={cn(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          agent.tint,
        )}
      >
        <AgentIcon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        {notification.text && (
          <span className="block text-sm text-ink">{notification.text}</span>
        )}
        <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          <StatusIcon
            size={13}
            className={cn(status.tint, status.spin && 'animate-spin')}
            aria-hidden="true"
          />
          <span>{t(agent.labelKey)}</span>
          <span aria-hidden="true">·</span>
          <span>{t(statusLabelKey[presentedStatus])}</span>
          <span aria-hidden="true">·</span>
          <span>{formatRelative(notification.updatedAt)}</span>
        </span>
      </span>
    </div>
  );
}
