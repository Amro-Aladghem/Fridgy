import { useState } from 'react';
import { AlertTriangle, CalendarClock, Package, PackageCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKey } from '@/contexts/LanguageContext';
import { MonitoringProductsDialog } from '@/components/monitoring/MonitoringProductsDialog';
import { getExpiryState, isFinished } from '@/libs/productStatus';
import { cn } from '@/libs/cn';
import type { ProductDto } from '@/types/product';
import type { FridgeProduct } from '@/types/ui';

type MonitoringCategory = 'all' | 'expired' | 'approaching' | 'finished';

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

interface MonitoringSummaryProps {
  products: FridgeProduct[];
  expiredProducts: ProductDto[];
}

export function MonitoringSummary({ products, expiredProducts }: MonitoringSummaryProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<MonitoringCategory | null>(null);

  const productsFor = (category: MonitoringCategory): FridgeProduct[] => {
    switch (category) {
      case 'all':
        return products;
      case 'expired':
        return expiredProducts;
      case 'approaching':
        return products.filter((product) => getExpiryState(product.expiryDate) === 'approaching');
      case 'finished':
        return products.filter((product) => isFinished(product));
    }
  };

  const active = categories.find((category) => category.key === activeCategory) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ key, labelKey, Icon, tint }) => {
          const count = productsFor(key).length;
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
        products={active ? productsFor(active.key) : []}
      />
    </div>
  );
}
