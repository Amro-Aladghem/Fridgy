import { BellOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotificationItem } from '@/components/notifications/NotificationItem';

interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationDialog({ open, onClose }: NotificationDialogProps) {
  const { t } = useLanguage();
  const { notifications } = useChat();

  return (
    <Dialog open={open} onClose={onClose} title={t('notifications')} size="sm">
      {notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff size={20} />}
          title={t('noNotifications')}
          description={t('noNotificationsHint')}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((notification, index) => (
            <li key={notification.id}>
              <NotificationItem
                notification={notification}
                isLast={index === notifications.length - 1}
              />
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
