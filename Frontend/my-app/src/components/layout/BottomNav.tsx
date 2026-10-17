import { useState } from 'react';
import { Home, Menu, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavLink } from '@/libs/router';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { NavigationMenu } from '@/components/layout/NavigationMenu';
import { cn } from '@/libs/cn';

const itemClass =
  'flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export function BottomNav() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setMenuOpen(false));

  const stateClass = (active: boolean) =>
    cn(itemClass, active ? 'bg-mint text-primary-dark' : 'text-muted hover:bg-ink/5 hover:text-ink');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur">
      <div ref={ref} className="relative mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {menuOpen && (
          <div className="absolute bottom-[calc(100%+0.5rem)] start-2 z-40">
            <NavigationMenu onNavigate={() => setMenuOpen(false)} />
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className={stateClass(menuOpen)}
        >
          <Menu size={20} />
          <span>{t('menu')}</span>
        </button>

        <NavLink
          to="/shopping-lists"
          className={({ isActive }) => stateClass(isActive)}
        >
          <ShoppingCart size={20} />
          <span>{t('navShoppingLists')}</span>
        </NavLink>

        <NavLink to="/" className={({ isActive }) => stateClass(isActive)}>
          <Home size={20} />
          <span>{t('navHome')}</span>
        </NavLink>
      </div>
    </nav>
  );
}
