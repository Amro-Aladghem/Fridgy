import { useState } from 'react';
import { CalendarPlus, Check, Package, Pencil, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { getExpiryState } from '@/libs/productStatus';
import { formatDate, formatPrice, fromDateInputValue, toDateInputValue } from '@/libs/format';
import { cn } from '@/libs/cn';
import type { ProductDto } from '@/types/product';
import type { FridgeProduct } from '@/types/ui';

interface ProductDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  product: FridgeProduct | null;
  onSave: (id: string, changes: Partial<ProductDto>) => void;
}

interface FormState {
  name: string;
  description: string;
  quantity: string;
  price: string;
  producedDate: string;
  expiryDate: string;
}

const emptyForm: FormState = {
  name: '',
  description: '',
  quantity: '',
  price: '',
  producedDate: '',
  expiryDate: '',
};

function buildForm(product: FridgeProduct | null): FormState {
  if (!product) return emptyForm;
  return {
    name: product.name,
    description: product.description ?? '',
    quantity: `${product.quantity ?? 0}`,
    price: product.price === null || product.price === undefined ? '' : `${product.price}`,
    producedDate: toDateInputValue(product.producedDate),
    expiryDate: toDateInputValue(product.expiryDate),
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-end text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

const inputClasses =
  'w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15';

export function ProductDetailsDialog({
  open,
  onClose,
  product,
  onSave,
}: ProductDetailsDialogProps) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [requireExpiry, setRequireExpiry] = useState(false);
  const [form, setForm] = useState<FormState>(() => buildForm(product));
  const [error, setError] = useState<string | null>(null);
  const [stateKey, setStateKey] = useState<string | null>(null);

  const currentKey = open && product ? (product.id ?? '') : null;
  if (currentKey !== stateKey) {
    setStateKey(currentKey);
    setForm(buildForm(open ? product : null));
    setEditing(false);
    setRequireExpiry(false);
    setError(null);
  }

  if (!product) {
    return (
      <Dialog open={open} onClose={onClose} title={t('productDetails')}>
        <p className="text-sm text-muted">{t('nothingHere')}</p>
      </Dialog>
    );
  }

  const setField = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const startEditingExpiry = () => {
    setEditing(true);
    setRequireExpiry(true);
    setError(null);
  };

  const handleCancel = () => {
    setForm(buildForm(product));
    setEditing(false);
    setRequireExpiry(false);
    setError(null);
  };

  const handleSave = () => {
    const name = form.name.trim();
    if (!name) return;

    const expiryIso = form.expiryDate ? fromDateInputValue(form.expiryDate) : null;
    if (form.expiryDate && !expiryIso) {
      setError(t('invalidDate'));
      return;
    }
    if (requireExpiry && !form.expiryDate) {
      setError(t('expiryRequired'));
      return;
    }

    onSave(product.id as string, {
      name,
      description: form.description.trim() || null,
      quantity: Number(form.quantity) || 0,
      price: form.price.trim() === '' ? null : Number(form.price),
      producedDate: form.producedDate ? fromDateInputValue(form.producedDate) : null,
      expiryDate: expiryIso,
    });

    setEditing(false);
    setRequireExpiry(false);
    setError(null);
  };

  const expiryInPast = Boolean(form.expiryDate) && getExpiryState(fromDateInputValue(form.expiryDate)) === 'expired';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('productDetails')}
      footer={
        editing ? (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X size={16} />
              {t('cancel')}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!form.name.trim()}>
              <Check size={16} />
              {t('save')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              <Pencil size={16} />
              {t('edit')}
            </Button>
          </div>
        )
      }
    >
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-mint ring-1 ring-line">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <Package size={28} className="text-primary-dark" />
          )}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-ink">{product.name}</h3>
        </div>
      </div>

      {!editing ? (
        <div className="mt-5">
          <dl>
            <Row label={t('description')} value={product.description || t('notSet')} />
            <Row label={t('quantity')} value={`${product.quantity}`} />
            <Row
              label={t('price')}
              value={product.price === null || product.price === undefined ? t('notSet') : formatPrice(product.price)}
            />
            <Row label={t('producedDate')} value={formatDate(product.producedDate) || t('notSet')} />
            <Row label={t('expiryDate')} value={formatDate(product.expiryDate) || t('notSet')} />
          </dl>

          {!product.expiryDate && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-warn/30 bg-warn-soft/60 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-warn">{t('expiryNotSet')}</p>
              <Button size="sm" variant="secondary" onClick={startEditingExpiry} className="shrink-0">
                <CalendarPlus size={16} />
                {t('setExpiryDate')}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">{t('name')}</span>
            <input
              className={inputClasses}
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">{t('description')}</span>
            <textarea
              className={cn(inputClasses, 'min-h-20 resize-y')}
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">{t('quantity')}</span>
              <input
                type="number"
                min={0}
                className={inputClasses}
                value={form.quantity}
                onChange={(event) => setField('quantity', event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">{t('price')}</span>
              <input
                type="number"
                min={0}
                step="0.01"
                className={inputClasses}
                value={form.price}
                onChange={(event) => setField('price', event.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">{t('producedDate')}</span>
              <input
                type="date"
                className={inputClasses}
                value={form.producedDate}
                onChange={(event) => setField('producedDate', event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">{t('expiryDate')}</span>
              <input
                type="date"
                className={inputClasses}
                value={form.expiryDate}
                onChange={(event) => {
                  setField('expiryDate', event.target.value);
                  setError(null);
                }}
              />
            </label>
          </div>

          {expiryInPast && <p className="text-xs text-warn">{t('expiryInPast')}</p>}
          {error && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </Dialog>
  );
}
