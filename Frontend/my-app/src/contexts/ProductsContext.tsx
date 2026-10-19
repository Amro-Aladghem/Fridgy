import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import inventoryService from '@/services/inventoryService';
import { INVENTORY_ID } from '@/libs/config';
import type { ProductDto } from '@/types/product';
import type { FridgeProduct } from '@/types/ui';

interface ProductsContextValue {
  products: FridgeProduct[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  updateProduct: (id: string, changes: Partial<ProductDto>) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<FridgeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    inventoryService
      .getProducts(INVENTORY_ID)
      .then((response) => {
        if (!active) return;
        if (response.isSuccess) {
          setProducts(response.data);
          setError(null);
        } else {
          setError(response.error);
        }
      })
      .catch(() => {
        if (active) setError('Unexpected error occurred');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setNonce((value) => value + 1);
  }, []);

  const updateProduct = useCallback(
    async (id: string, changes: Partial<ProductDto>) => {
      const current = products.find((product) => product.id === id);
      if (!current) return;

      setProducts((prev) =>
        prev.map((product) => (product.id === id ? { ...product, ...changes } : product)),
      );

      const payload: ProductDto = { ...current, ...changes, inventoryId: INVENTORY_ID };
      const response = await inventoryService.updateProduct(INVENTORY_ID, id, payload);
      if (!response.isSuccess) {
        setError(response.error);
      }
    },
    [products],
  );

  const value = useMemo(
    () => ({ products, loading, error, reload, updateProduct }),
    [products, loading, error, reload, updateProduct],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}
