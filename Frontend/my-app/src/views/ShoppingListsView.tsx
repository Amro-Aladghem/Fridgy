import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingListCard } from '@/components/shopping/ShoppingListCard';
import { ShoppingListDetail } from '@/components/shopping/ShoppingListDetail';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockShoppingLists } from '@/libs/mock/mockShoppingLists';
import type { UiShoppingList } from '@/types/ui';

const purchasedKey = (listId: string) => `fridgy:purchased:${listId}`;

function readPurchased(listId: string): string[] {
  try {
    const raw = sessionStorage.getItem(purchasedKey(listId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writePurchased(listId: string, ids: string[]): void {
  try {
    sessionStorage.setItem(purchasedKey(listId), JSON.stringify(ids));
  } catch {
    /* session storage unavailable */
  }
}

function hydrateLists(): UiShoppingList[] {
  return mockShoppingLists.map((list) => {
    const purchased = readPurchased(list.id ?? '');
    return {
      ...list,
      items: list.items.map((item) => ({
        ...item,
        isPurchased: purchased.includes(item.id),
      })),
    };
  });
}

export function ShoppingListsView() {
  const { t } = useLanguage();
  const [lists, setLists] = useState<UiShoppingList[]>(hydrateLists);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = lists.find((list) => list.id === selectedId) ?? null;

  const handleToggleItem = (itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== selectedId) return list;
        const items = list.items.map((item) =>
          item.id === itemId ? { ...item, isPurchased: !item.isPurchased } : item,
        );
        writePurchased(
          list.id ?? '',
          items.filter((item) => item.isPurchased).map((item) => item.id),
        );
        return { ...list, items };
      }),
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-ink sm:text-2xl">{t('shoppingTitle')}</h1>
        <p className="mt-1 text-sm text-muted">{t('shoppingSubtitle')}</p>
      </div>

      {lists.length === 0 ? (
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

      <ShoppingListDetail
        list={selected}
        onClose={() => setSelectedId(null)}
        onToggleItem={handleToggleItem}
      />
    </div>
  );
}
