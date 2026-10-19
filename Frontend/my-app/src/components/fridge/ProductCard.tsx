import { Hash, ShoppingBasket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/libs/cn';
import type { FridgeProduct } from '@/types/ui';

interface ProductCardProps {
  product: FridgeProduct;
  onSelect: (product: FridgeProduct) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      title={product.name}
      className={cn(
        'flex flex-col gap-1.5 rounded-xl border border-line bg-surface p-2 text-start shadow-sm',
        'transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      )}
    >
      <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-mint/50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <ShoppingBasket size={22} className="text-primary-dark" />
        )}
      </span>

      <span className="line-clamp-2 text-[11px] font-medium leading-tight text-ink">
        {product.name}
      </span>

      <span className="flex items-center gap-1 text-[10px] text-muted">
        <Hash size={12} className="shrink-0" />
        <span>
          {t('amount')}: <span className="font-bold text-ink">{product.quantity}</span>
        </span>
      </span>
    </button>
  );
}
