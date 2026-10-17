import { ShoppingBasket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/libs/format';
import type { FridgeProduct } from '@/types/ui';

interface MonitoringProductsDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  products: FridgeProduct[];
}

export function MonitoringProductsDialog({
  open,
  onClose,
  title,
  products,
}: MonitoringProductsDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onClose={onClose} title={title} placement="bottom">
      {products.length === 0 ? (
        <EmptyState icon={<ShoppingBasket size={20} />} title={t('nothingHere')} />
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mint/60">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="" className="h-7 w-7" draggable={false} />
                ) : (
                  <ShoppingBasket size={20} className="text-primary-dark" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">
                  {product.name}
                </span>
                <span className="text-xs text-muted">
                  {t('quantity')}: {product.quantity}
                </span>
              </span>

              <span className="shrink-0 text-end">
                <span className="block text-[11px] text-muted">{t('expiryDate')}</span>
                <span className="block text-xs font-medium text-ink">
                  {formatDate(product.expiryDate) || t('notSet')}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
