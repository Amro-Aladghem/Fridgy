import { useLanguage } from '@/contexts/LanguageContext';
import { Spinner } from '@/components/ui/Spinner';

export function LoadingState() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <Spinner className="h-7 w-7 text-primary" />
      <p className="text-sm">{t('loading')}</p>
    </div>
  );
}
