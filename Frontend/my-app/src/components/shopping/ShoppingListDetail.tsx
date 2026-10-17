import { CheckCircle2, Circle, ShoppingBasket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/libs/format';
import { cn } from '@/libs/cn';
import type { UiShoppingList } from '@/types/ui';

interface ShoppingListDetailProps {
  list: UiShoppingList | null;
  onClose: () => void;
  onToggleItem: (itemId: string) => void;
}

export function ShoppingListDetail({ list, onClose, onToggleItem }: ShoppingListDetailProps) {
  const { t } = useLanguage();

  const total = list?.items.length ?? 0;
  const purchased = list?.items.filter((item) => item.isPurchased).length ?? 0;

  return (
    <Dialog
      open={Boolean(list)}
      onClose={onClose}
      title={list?.title || t('shoppingTitle')}
      placement="bottom"
      footer={
        <div className="flex items-center justify-between gap-3 text-xs text-muted">
          <span>
            {purchased}/{total} {t('purchasedCount')}
          </span>
          {list?.dateOfCreation && (
            <span>
              {t('createdOn')} {formatDate(list.dateOfCreation)}
            </span>
          )}
        </div>
      }
    >
      {list && (
        <div className="flex flex-col gap-4">
          {list.items.length === 0 ? (
            <EmptyState icon={<ShoppingBasket size={20} />} title={t('listEmpty')} />
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {list.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggleItem(item.id)}
                  aria-pressed={item.isPurchased}
                  title={t('togglePurchased')}
                  className={cn(
                    'flex flex-col gap-1.5 rounded-xl border bg-surface p-2 text-start transition-shadow hover:shadow-md',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    item.isPurchased ? 'border-primary/30' : 'border-line',
                  )}
                >
                  <span className="relative flex aspect-square w-full items-center justify-center rounded-lg bg-mint/50">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="h-10 w-10" draggable={false} />
                    ) : (
                      <ShoppingBasket size={22} className="text-primary-dark" />
                    )}
                    <span className="absolute -end-1 -top-1 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-line">
                      {item.isPurchased ? (
                        <CheckCircle2 size={15} className="text-primary" />
                      ) : (
                        <Circle size={15} className="text-muted" />
                      )}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'line-clamp-2 text-[11px] font-medium leading-tight',
                      item.isPurchased ? 'text-muted line-through' : 'text-ink',
                    )}
                  >
                    {item.name}
                  </span>
                  <span className="text-[10px] text-muted">
                    {item.isPurchased ? t('purchased') : t('pending')}
                  </span>
                </button>
              ))}
            </div>
          )}

          <section className="rounded-xl border border-line bg-canvas p-4">
            <h3 className="text-sm font-semibold text-ink">{t('moreInfo')}</h3>
            <p className="mt-1 text-sm text-muted">{list.description || t('notSet')}</p>
          </section>
        </div>
      )}
    </Dialog>
  );
}
