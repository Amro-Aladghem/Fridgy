import type { ProductDto } from '@/types/product';
import type { ExpiryState } from '@/types/ui';

export const APPROACHING_WINDOW_DAYS = 3;

const DAY_MS = 1000 * 60 * 60 * 24;

export function getExpiryState(
  expiryDate?: string | null,
  now: number = Date.now(),
): ExpiryState {
  if (!expiryDate) return 'unknown';
  const expiry = new Date(expiryDate).getTime();
  if (Number.isNaN(expiry)) return 'unknown';
  if (expiry < now) return 'expired';
  if (expiry - now <= APPROACHING_WINDOW_DAYS * DAY_MS) return 'approaching';
  return 'fresh';
}

export function daysUntil(expiryDate?: string | null, now: number = Date.now()): number | null {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate).getTime();
  if (Number.isNaN(expiry)) return null;
  return Math.ceil((expiry - now) / DAY_MS);
}

export const expiryStateLabelKey: Record<
  ExpiryState,
  'statusFresh' | 'statusApproaching' | 'statusExpired' | 'statusUnknown'
> = {
  fresh: 'statusFresh',
  approaching: 'statusApproaching',
  expired: 'statusExpired',
  unknown: 'statusUnknown',
};

export const productStatusLabels: Record<number, string> = {
  1: 'Available',
  2: 'Low stock',
  3: 'Consumed',
};

export type MonitoringCategory = 'all' | 'expired' | 'approaching' | 'finished';

export function isFinished(
  product: Pick<ProductDto, 'quantity' | 'productStatusId'>,
): boolean {
  return (product.quantity ?? 0) <= 0 || product.productStatusId === 3;
}

export function matchesMonitoringCategory(
  product: ProductDto,
  category: MonitoringCategory,
): boolean {
  switch (category) {
    case 'all':
      return true;
    case 'expired':
      return getExpiryState(product.expiryDate) === 'expired';
    case 'approaching':
      return getExpiryState(product.expiryDate) === 'approaching';
    case 'finished':
      return isFinished(product);
    default:
      return true;
  }
}
