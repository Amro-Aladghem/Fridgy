import type { NotificationDto } from '@/types/notification';
import type { ProductDto } from '@/types/product';
import type { ShoppingListDto } from '@/types/shoppingList';

export type ExpiryState = 'fresh' | 'approaching' | 'expired' | 'unknown';

export interface FridgeProduct extends ProductDto {
  xPct: number;
  yPct: number;
}

export interface AppNotification extends NotificationDto {
  title: string;
  isRead: boolean;
}

export interface UiShoppingListItem {
  id: string;
  name: string;
  imageUrl?: string | null;
  isPurchased: boolean;
}

export interface UiShoppingList extends ShoppingListDto {
  items: UiShoppingListItem[];
}
