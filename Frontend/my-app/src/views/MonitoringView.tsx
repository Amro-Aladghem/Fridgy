import { useLanguage } from '@/contexts/LanguageContext';
import { MonitoringSummary } from '@/components/monitoring/MonitoringSummary';

export function MonitoringView() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-ink sm:text-2xl">{t('monitoringTitle')}</h1>
        <p className="mt-1 text-sm text-muted">{t('monitoringSubtitle')}</p>
      </div>

      <MonitoringSummary />
    </div>
  );
}
