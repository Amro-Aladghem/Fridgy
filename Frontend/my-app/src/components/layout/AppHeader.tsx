import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import logo from '@/assets/Logo.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { IconButton } from '@/components/ui/IconButton';
import { Badge } from '@/components/ui/Badge';
import { NavigationMenu } from '@/components/layout/NavigationMenu';
import { NotificationDialog } from '@/components/notifications/NotificationDialog';
import { NavLink } from '@/libs/router';

export function AppHeader() {
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const menuRef = useOutsideClick<HTMLDivElement>(() => setMenuOpen(false));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <div className="relative flex items-center gap-2" ref={menuRef}>
          <IconButton
            label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </IconButton>

          {menuOpen && (
            <div className="absolute start-0 top-12 z-50">
              <NavigationMenu onNavigate={() => setMenuOpen(false)} />
            </div>
          )}
        </div>

        <NavLink to="/" className="flex items-center" aria-label={t('appName')}>
          <img
            src={logo}
            alt={t('appName')}
            className="h-9 w-auto sm:h-10"
            draggable={false}
          />
        </NavLink>

        <div className="flex items-center gap-1">
          <div className="relative">
            <IconButton label={t('notifications')} onClick={() => setNotificationsOpen(true)}>
              <Bell size={20} />
            </IconButton>
            {unreadCount > 0 && (
              <Badge className="pointer-events-none absolute -top-0.5 end-0.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <NotificationDialog
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </header>
  );
}
