import { useMemo, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingListCard } from '@/components/shopping/ShoppingListCard';
import { ShoppingListDetail } from '@/components/shopping/ShoppingListDetail';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAsyncData } from '@/hooks/useAsyncData';
import inventoryService from '@/services/inventoryService';
import { INVENTORY_ID } from '@/libs/config';
import type { UiShoppingList } from '@/types/ui';

export function ShoppingListsView() {
  const { t } = useLanguage();
  const { data, loading, error, reload } = useAsyncData(
    () => inventoryService.getShoppingListsHistory(INVENTORY_ID),
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const lists = useMemo<UiShoppingList[]>(
    () => (data ?? []).map((list) => ({ ...list, items: [] })),
    [data],
  );

  const selected = lists.find((list) => list.id === selectedId) ?? null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-ink sm:text-2xl">{t('shoppingTitle')}</h1>
        <p className="mt-1 text-sm text-muted">{t('shoppingSubtitle')}</p>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : lists.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart size={20} />}
          title={t('noShoppingLists')}
          description={t('noShoppingListsHint')}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {lists.map((list) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              onOpen={() => setSelectedId(list.id ?? null)}
            />
          ))}
        </div>
      )}

      <ShoppingListDetail list={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
