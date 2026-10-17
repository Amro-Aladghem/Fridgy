import { ChevronRight, ListChecks } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate } from '@/libs/format';
import { cn } from '@/libs/cn';
import type { UiShoppingList } from '@/types/ui';

interface ShoppingListCardProps {
  list: UiShoppingList;
  onOpen: (list: UiShoppingList) => void;
}

export function ShoppingListCard({ list, onOpen }: ShoppingListCardProps) {
  const { t } = useLanguage();
  const total = list.items.length;
  const purchased = list.items.filter((item) => item.isPurchased).length;
  const progress = total === 0 ? 0 : Math.round((purchased / total) * 100);

  return (
    <button
      type="button"
      onClick={() => onOpen(list)}
      className={cn(
        'group flex w-full flex-col gap-3 rounded-2xl border border-line bg-surface p-4 text-start shadow-sm',
        'transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-primary-dark">
            <ListChecks size={18} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">{list.title || t('shoppingTitle')}</h3>
            {list.description && <p className="text-xs text-muted">{list.description}</p>}
            <p className="mt-0.5 text-xs text-muted">
              {t('createdOn')} {formatDate(list.dateOfCreation)}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>
            {total} {t('items')}
          </span>
          <span>
            {purchased}/{total} {t('purchasedCount')}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-mint">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </button>
  );
}
