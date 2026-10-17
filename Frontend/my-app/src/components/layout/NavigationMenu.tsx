import { useEffect } from 'react';
import { Activity, Home, Refrigerator, ShoppingCart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKey } from '@/contexts/LanguageContext';
import { NavLink } from '@/libs/router';
import { cn } from '@/libs/cn';

interface NavItem {
  to: string;
  key: TranslationKey;
  Icon: LucideIcon;
}

const items: NavItem[] = [
  { to: '/', key: 'navHome', Icon: Home },
  { to: '/fridge', key: 'navFridge', Icon: Refrigerator },
  { to: '/shopping-lists', key: 'navShoppingLists', Icon: ShoppingCart },
  { to: '/monitoring', key: 'navMonitoring', Icon: Activity },
];

export function NavigationMenu({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onNavigate();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onNavigate]);

  return (
    <nav
      aria-label={t('menu')}
      className="animate-pop-in w-60 rounded-2xl border border-line bg-surface p-2 shadow-xl"
    >
      <ul className="flex flex-col gap-1">
        {items.map(({ to, key, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onNavigate={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-mint text-primary-dark' : 'text-ink hover:bg-ink/5',
                )
              }
            >
              <Icon size={18} />
              <span>{t(key)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
