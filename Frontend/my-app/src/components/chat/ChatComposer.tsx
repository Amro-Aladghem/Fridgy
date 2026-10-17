import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { Mic, Paperclip, SendHorizontal, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/libs/cn';

interface ChatComposerProps {
  onSubmit: (message: string, file: File | null) => void | Promise<void>;
  loading?: boolean;
  placeholder?: string;
  focusToken?: number;
}

export function ChatComposer({
  onSubmit,
  loading = false,
  placeholder,
  focusToken = 0,
}: ChatComposerProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const [voiceHint, setVoiceHint] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { ref, resize } = useAutoResizeTextarea(160);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    if (focusToken > 0) ref.current?.focus();
  }, [focusToken, ref]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canSend = (value.trim().length > 0 || file !== null) && !loading;

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async () => {
    if (!canSend) return;
    const message = value.trim();
    const attached = file;
    setValue('');
    clearFile();
    await onSubmit(message, attached);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-surface p-2 shadow-sm focus-within:border-primary/40"
    >
      {previewUrl && (
        <div className="mb-2">
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt=""
              className="h-16 w-16 rounded-lg object-cover ring-1 ring-line"
            />
            <button
              type="button"
              onClick={clearFile}
              aria-label={t('close')}
              className="absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-white hover:bg-ink"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-1">
        <IconButton
          type="button"
          label={t('attachImage')}
          onClick={() => fileRef.current?.click()}
          disabled={loading}
        >
          <Paperclip size={18} />
        </IconButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          ref={ref}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          dir="auto"
          rows={1}
          placeholder={placeholder ?? t('composerPlaceholder')}
          aria-label={placeholder ?? t('composerPlaceholder')}
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted"
        />
        <IconButton
          type="button"
          label={t('voiceInput')}
          onClick={() => setVoiceHint(true)}
          disabled={loading}
        >
          <Mic size={18} />
        </IconButton>
        <button
          type="submit"
          disabled={!canSend}
          aria-label={t('send')}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-colors',
            'hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          {loading ? <Spinner className="text-white" /> : <SendHorizontal size={18} />}
        </button>
      </div>
      {voiceHint && (
        <p className="px-3 pb-1 pt-2 text-xs text-muted" role="status">
          {t('voiceUnavailable')}
        </p>
      )}
    </form>
  );
}
