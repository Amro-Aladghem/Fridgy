import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { mockProducts } from '@/libs/mock/mockProducts';
import type { ProductDto } from '@/types/product';
import type { FridgeProduct } from '@/types/ui';

interface ProductsContextValue {
  products: FridgeProduct[];
  getProduct: (id: string) => FridgeProduct | undefined;
  updateProduct: (id: string, changes: Partial<ProductDto>) => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<FridgeProduct[]>(mockProducts);

  const getProduct = useCallback(
    (id: string) => products.find((product) => product.id === id),
    [products],
  );

  const updateProduct = useCallback((id: string, changes: Partial<ProductDto>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...changes } : product)),
    );
  }, []);

  const value = useMemo(
    () => ({ products, getProduct, updateProduct }),
    [products, getProduct, updateProduct],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}
