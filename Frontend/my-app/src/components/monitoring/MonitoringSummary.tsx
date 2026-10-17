import { useState } from 'react';
import { AlertTriangle, CalendarClock, Package, PackageCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKey } from '@/contexts/LanguageContext';
import { useProducts } from '@/contexts/ProductsContext';
import { MonitoringProductsDialog } from '@/components/monitoring/MonitoringProductsDialog';
import { matchesMonitoringCategory } from '@/libs/productStatus';
import type { MonitoringCategory } from '@/libs/productStatus';
import { cn } from '@/libs/cn';

interface CategoryConfig {
  key: MonitoringCategory;
  labelKey: TranslationKey;
  Icon: LucideIcon;
  tint: string;
}

const categories: CategoryConfig[] = [
  { key: 'all', labelKey: 'monAll', Icon: Package, tint: 'bg-mint text-primary-dark' },
  { key: 'expired', labelKey: 'monExpired', Icon: AlertTriangle, tint: 'bg-danger-soft text-danger' },
  { key: 'approaching', labelKey: 'monSoon', Icon: CalendarClock, tint: 'bg-warn-soft text-warn' },
  { key: 'finished', labelKey: 'monFinished', Icon: PackageCheck, tint: 'bg-ink/5 text-muted' },
];

export function MonitoringSummary() {
  const { t } = useLanguage();
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState<MonitoringCategory | null>(null);

  const active = categories.find((category) => category.key === activeCategory) ?? null;
  const activeProducts = active
    ? products.filter((product) => matchesMonitoringCategory(product, active.key))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ key, labelKey, Icon, tint }) => {
          const count = products.filter((product) =>
            matchesMonitoringCategory(product, key),
          ).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCategory(key)}
              className={cn(
                'flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 text-start shadow-sm',
                'transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              )}
            >
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tint)}>
                <Icon size={18} />
              </span>
              <span className="text-2xl font-semibold leading-none text-ink">{count}</span>
              <span className="text-sm text-muted">{t(labelKey)}</span>
            </button>
          );
        })}
      </div>

      <MonitoringProductsDialog
        open={active !== null}
        onClose={() => setActiveCategory(null)}
        title={active ? t(active.labelKey) : ''}
        products={activeProducts}
      />
    </div>
  );
}
