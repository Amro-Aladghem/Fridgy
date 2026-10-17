import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/libs/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import { IconButton } from '@/components/ui/IconButton';

type DialogSize = 'sm' | 'md' | 'lg';
type DialogPlacement = 'center' | 'bottom';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  placement?: DialogPlacement;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
};

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  placement = 'center',
}: DialogProps) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const isBottom = placement === 'bottom';

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-[1px]',
        isBottom ? 'items-end' : 'items-end sm:items-center sm:p-4',
      )}
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn(
          'flex max-h-[92vh] w-full flex-col bg-surface shadow-xl outline-none',
          isBottom
            ? 'animate-slide-up rounded-t-3xl'
            : 'animate-pop-in rounded-t-2xl sm:rounded-2xl',
          isBottom ? 'max-w-2xl' : sizeClasses[size],
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <IconButton label={t('close')} onClick={onClose}>
            <X size={18} />
          </IconButton>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="border-t border-line px-5 py-4">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
