import { Loader2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AgentMascot } from '@/components/agents/AgentMascot';
import { ChatImage } from '@/components/chat/ChatImage';
import { MessageProducts } from '@/components/chat/MessageProducts';
import { statusLabelKey } from '@/components/notifications/notificationPresentation';
import { agentMeta, fallbackAgentMeta } from '@/libs/agentMeta';
import { parseProductData, resolveMessageText } from '@/libs/chatGrouping';
import { cn } from '@/libs/cn';
import type { NotificationStatus } from '@/types/enums';
import type { ChatExecutionGroup as ChatExecutionGroupType } from '@/types/chatSession';

const statusStyles: Record<NotificationStatus, string> = {
  Queued: 'bg-ink/5 text-muted',
  Running: 'bg-mint text-primary-dark',
  WaitingForUser: 'bg-warn-soft text-warn',
  Completed: 'bg-mint text-primary-dark',
  Failed: 'bg-danger-soft text-danger',
};

interface AgentExecutionGroupProps {
  group: ChatExecutionGroupType;
}

export function AgentExecutionGroup({ group }: AgentExecutionGroupProps) {
  const { t } = useLanguage();
  const meta = group.agentType ? agentMeta[group.agentType] : fallbackAgentMeta;
  const status = group.status;
  const waiting = status === 'WaitingForUser';
  const busy = status === 'Running' || status === 'Queued';

  return (
    <div className="flex justify-start">
      <div className="flex max-w-[85%] gap-2">
        <div className="w-8 shrink-0 pt-1">
          <AgentMascot src={meta.src} name={t(meta.labelKey)} />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted">{t(meta.labelKey)}</span>
            {status !== null && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                  statusStyles[status],
                )}
              >
                {busy && <Loader2 size={11} className="animate-spin" aria-hidden="true" />}
                {waiting && <MessageCircle size={11} aria-hidden="true" />}
                {t(statusLabelKey[status])}
              </span>
            )}
          </div>

          {group.messages.length === 0 ? (
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-line bg-surface px-3 py-2 text-sm text-muted">
              {waiting ? (
                <MessageCircle size={14} className="text-warn" aria-hidden="true" />
              ) : (
                <Loader2 size={14} className="animate-spin text-primary" aria-hidden="true" />
              )}
              <span>{status !== null ? t(statusLabelKey[status]) : t('chatStatusRunning')}</span>
            </div>
          ) : (
            group.messages.map((message, index) => {
              const text = resolveMessageText(message.message);
              const products = parseProductData(message.data);
              return (
                <div
                  key={`${group.id}-${index}`}
                  className="overflow-hidden rounded-2xl rounded-tl-sm border border-line bg-surface px-3 py-2 text-sm text-ink"
                >
                  <ChatImage
                    src={message.imageUrl}
                    className="mb-2 max-h-56 w-full rounded-lg object-cover"
                  />
                  {text && (
                    <p dir="auto" className="whitespace-pre-wrap break-words">
                      {text}
                    </p>
                  )}
                  <MessageProducts products={products} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
