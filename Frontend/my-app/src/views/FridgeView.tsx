import { useState } from 'react';
import { Refrigerator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/contexts/ProductsContext';
import { FridgeIllustration } from '@/components/fridge/FridgeIllustration';
import { ProductCard } from '@/components/fridge/ProductCard';
import { ProductDetailsDialog } from '@/components/fridge/ProductDetailsDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { ProductDto } from '@/types/product';

export function FridgeView() {
  const { t } = useLanguage();
  const { products, loading, error, reload, updateProduct } = useProducts();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = products.find((product) => product.id === selectedId) ?? null;

  const handleSave = (id: string, changes: Partial<ProductDto>) => {
    void updateProduct(id, changes);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-ink sm:text-2xl">{t('fridgeTitle')}</h1>
        <p className="mt-1 text-sm text-muted">
          {open ? t('fridgeOpenHint') : t('fridgeSubtitle')}
        </p>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Refrigerator size={20} />}
          title={t('emptyFridge')}
          description={t('emptyFridgeHint')}
        />
      ) : (
        <FridgeIllustration
          open={open}
          onToggle={() => setOpen((value) => !value)}
          label={open ? t('fridgeOpenHint') : t('fridgeSubtitle')}
          closeLabel={t('close')}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => setSelectedId(product.id ?? null)}
              />
            ))}
          </div>
        </FridgeIllustration>
      )}

      <ProductDetailsDialog
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        product={selected}
        onSave={handleSave}
      />
    </div>
  );
}
