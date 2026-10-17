import appleImg from '@/assets/products/apple.svg';
import breadImg from '@/assets/products/bread.svg';
import cheeseImg from '@/assets/products/cheese.svg';
import milkImg from '@/assets/products/milk.svg';
import type { UiShoppingList } from '@/types/ui';
import { MOCK_INVENTORY_ID } from '@/libs/mock/mockProducts';

const iso = (daysAgo: number): string =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString();

export const mockShoppingLists: UiShoppingList[] = [
  {
    id: 's0000001-0000-4000-8000-000000000001',
    inventoryId: MOCK_INVENTORY_ID,
    title: 'Weekly Groceries',
    description: 'Everything we need for the week',
    dateOfCreation: iso(2),
    items: [
      { id: 'i1', name: 'Whole Milk', imageUrl: milkImg, isPurchased: true },
      { id: 'i2', name: 'Brown Eggs', imageUrl: null, isPurchased: false },
      { id: 'i3', name: 'Whole Wheat Bread', imageUrl: breadImg, isPurchased: false },
      { id: 'i4', name: 'Red Apples', imageUrl: appleImg, isPurchased: true },
      { id: 'i5', name: 'Chicken Breast', imageUrl: null, isPurchased: false },
    ],
  },
  {
    id: 's0000002-0000-4000-8000-000000000002',
    inventoryId: MOCK_INVENTORY_ID,
    title: 'Weekend BBQ',
    description: 'For Saturday evening',
    dateOfCreation: iso(1),
    items: [
      { id: 'i6', name: 'Burger Buns', imageUrl: breadImg, isPurchased: false },
      { id: 'i7', name: 'Ground Beef', imageUrl: null, isPurchased: false },
      { id: 'i8', name: 'Lettuce', imageUrl: null, isPurchased: false },
      { id: 'i9', name: 'Cheddar Cheese', imageUrl: cheeseImg, isPurchased: false },
    ],
  },
  {
    id: 's0000003-0000-4000-8000-000000000003',
    inventoryId: MOCK_INVENTORY_ID,
    title: 'Pantry Restock',
    description: 'Long-life staples',
    dateOfCreation: iso(6),
    items: [
      { id: 'i10', name: 'Olive Oil', imageUrl: null, isPurchased: true },
      { id: 'i11', name: 'Pasta', imageUrl: null, isPurchased: true },
      { id: 'i12', name: 'Rice', imageUrl: null, isPurchased: false },
    ],
  },
];
