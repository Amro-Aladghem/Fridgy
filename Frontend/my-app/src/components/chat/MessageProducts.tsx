import { Package } from 'lucide-react';
import { ChatImage } from '@/components/chat/ChatImage';
import type { ProductDto } from '@/types/product';

interface MessageProductsProps {
  products: ProductDto[];
}

export function MessageProducts({ products }: MessageProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-2 grid grid-cols-3 gap-1.5">
      {products.map((product, index) => (
        <div
          key={product.id ?? `${product.name}-${index}`}
          className="flex flex-col gap-1 rounded-lg border border-line bg-canvas p-1.5"
        >
          <span className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-mint/50">
            {product.imageUrl ? (
              <ChatImage src={product.imageUrl} className="h-full w-full object-cover" />
            ) : (
              <Package size={16} className="text-primary-dark" aria-hidden="true" />
            )}
          </span>
          <span className="line-clamp-2 text-[10px] font-medium leading-tight text-ink">
            {product.name}
          </span>
        </div>
      ))}
    </div>
  );
}
