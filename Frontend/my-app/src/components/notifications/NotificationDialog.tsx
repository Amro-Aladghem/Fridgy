import { BellOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotificationItem } from '@/components/notifications/NotificationItem';

interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationDialog({ open, onClose }: NotificationDialogProps) {
  const { t } = useLanguage();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('notifications')}
      size="sm"
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted">
            {unreadCount > 0 ? `${unreadCount} ${t('unread')}` : t('noNotificationsHint')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            {t('markAllRead')}
          </Button>
        </div>
      }
    >
      {notifications.length === 0 ? (
        <EmptyState icon={<BellOff size={20} />} title={t('noNotifications')} description={t('noNotificationsHint')} />
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationItem notification={notification} onSelect={(item) => markRead(item.id)} />
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
