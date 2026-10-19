import type { ProductDto } from '@/types/product';
import type { ShoppingListDto } from '@/types/shoppingList';

export type ExpiryState = 'fresh' | 'approaching' | 'expired' | 'unknown';

export type FridgeProduct = ProductDto;

export interface UiShoppingListItem {
  id: string;
  name: string;
  imageUrl?: string | null;
  isPurchased: boolean;
}

export interface UiShoppingList extends ShoppingListDto {
  items: UiShoppingListItem[];
}
