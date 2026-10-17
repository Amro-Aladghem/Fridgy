import { ShoppingBasket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatusPill } from '@/components/ui/StatusPill';
import { expiryStateLabelKey, getExpiryState } from '@/libs/productStatus';
import { formatPrice } from '@/libs/format';
import { cn } from '@/libs/cn';
import type { ExpiryState, FridgeProduct } from '@/types/ui';

interface ProductCardProps {
  product: FridgeProduct;
  onSelect: (product: FridgeProduct) => void;
}

const dotClasses: Record<ExpiryState, string> = {
  fresh: 'bg-primary',
  approaching: 'bg-warn',
  expired: 'bg-danger',
  unknown: 'bg-muted',
};

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { t } = useLanguage();
  const state = getExpiryState(product.expiryDate);

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
      <span className="relative flex aspect-square w-full items-center justify-center rounded-lg bg-mint/50">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="h-10 w-10" draggable={false} />
        ) : (
          <ShoppingBasket size={22} className="text-primary-dark" />
        )}
        <span
          className={cn(
            'absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white',
            dotClasses[state],
          )}
        />
      </span>

      <span className="line-clamp-2 text-[11px] font-medium leading-tight text-ink">
        {product.name}
      </span>

      <span className="flex items-center justify-between text-[10px] text-muted">
        <span>×{product.quantity}</span>
        {product.price !== null && product.price !== undefined && (
          <span className="font-medium text-ink">{formatPrice(product.price)}</span>
        )}
      </span>

      <StatusPill state={state} label={t(expiryStateLabelKey[state])} />
    </button>
  );
}
