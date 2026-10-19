import { useEffect, useState } from 'react';
import { ShoppingBasket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import inventoryService from '@/services/inventoryService';
import { INVENTORY_ID } from '@/libs/config';
import { formatDate } from '@/libs/format';
import type { ProductDto } from '@/types/product';
import type { UiShoppingList, UiShoppingListItem } from '@/types/ui';

interface ShoppingListDetailProps {
  list: UiShoppingList | null;
  onClose: () => void;
}

interface LoadedItems {
  key: string | null;
  items: UiShoppingListItem[];
  error: string | null;
}

function toItem(product: ProductDto): UiShoppingListItem {
  return {
    id: product.id ?? '',
    name: product.name,
    imageUrl: product.imageUrl,
    isPurchased: false,
  };
}

export function ShoppingListDetail({ list, onClose }: ShoppingListDetailProps) {
  const { t } = useLanguage();
  const [state, setState] = useState<LoadedItems>({ key: null, items: [], error: null });
  const [nonce, setNonce] = useState(0);

  const listId = list?.id ?? null;

  useEffect(() => {
    if (!listId) return;
    let active = true;
    inventoryService
      .getProductsForShoppingList(INVENTORY_ID, listId)
      .then((response) => {
        if (!active) return;
        if (response.isSuccess) {
          setState({ key: listId, items: response.data.map(toItem), error: null });
        } else {
          setState({ key: listId, items: [], error: response.error });
        }
      })
      .catch(() => {
        if (active) {
          setState({ key: listId, items: [], error: 'Unexpected error occurred' });
        }
      });
    return () => {
      active = false;
    };
  }, [listId, nonce]);

  const loading = listId !== null && state.key !== listId;
  const error = listId !== null && state.key === listId ? state.error : null;
  const items = listId !== null && state.key === listId ? state.items : [];

  return (
    <Dialog
      open={Boolean(list)}
      onClose={onClose}
      title={list?.title || t('shoppingTitle')}
      placement="bottom"
      footer={
        <div className="flex items-center justify-between gap-3 text-xs text-muted">
          <span>
            {items.length} {t('items')}
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
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={() => setNonce((value) => value + 1)} />
          ) : items.length === 0 ? (
            <EmptyState icon={<ShoppingBasket size={20} />} title={t('listEmpty')} />
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface p-2"
                >
                  <span className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-mint/50">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <ShoppingBasket size={22} className="text-primary-dark" />
                    )}
                  </span>
                  <span className="line-clamp-2 text-[11px] font-medium leading-tight text-ink">
                    {item.name}
                  </span>
                </div>
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
