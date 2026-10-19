import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/contexts/ProductsContext';
import { MonitoringSummary } from '@/components/monitoring/MonitoringSummary';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAsyncData } from '@/hooks/useAsyncData';
import inventoryService from '@/services/inventoryService';
import { INVENTORY_ID } from '@/libs/config';

export function MonitoringView() {
  const { t } = useLanguage();
  const {
    products,
    loading: productsLoading,
    error: productsError,
    reload: reloadProducts,
  } = useProducts();

  const expired = useAsyncData(() => inventoryService.getExpiredProducts(INVENTORY_ID), []);

  const loading = productsLoading || expired.loading;
  const error = productsError ?? expired.error;

  const reloadAll = () => {
    reloadProducts();
    expired.reload();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-ink sm:text-2xl">{t('monitoringTitle')}</h1>
        <p className="mt-1 text-sm text-muted">{t('monitoringSubtitle')}</p>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reloadAll} />
      ) : (
        <MonitoringSummary products={products} expiredProducts={expired.data ?? []} />
      )}
    </div>
  );
}
