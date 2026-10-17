import { useState } from 'react';
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import inventoryAgent from '@/assets/InventoryAgent.png';
import monitoringAgent from '@/assets/MonitoringAgent.png';
import shoppingAgent from '@/assets/ShoppingAgent.png';
import logo from '@/assets/Logo.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';
import { AgentMascot } from '@/components/agents/AgentMascot';
import { ChatComposer } from '@/components/chat/ChatComposer';
import { cn } from '@/libs/cn';

interface LocalMessage {
  id: number;
  text: string;
  imageUrl?: string;
}

const chatAgents = [
  { src: inventoryAgent, name: 'Inventory' },
  { src: shoppingAgent, name: 'Shopping' },
  { src: monitoringAgent, name: 'Monitoring' },
];

export function HomeView() {
  const { t } = useLanguage();
  const { chatOpen, openChat, closeChat } = useChat();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [focusToken, setFocusToken] = useState(0);

  const handleSubmit = async (text: string, file: File | null) => {
    const imageUrl = file ? URL.createObjectURL(file) : undefined;
    setMessages((prev) => [...prev, { id: Date.now(), text, imageUrl }]);
  };

  const handleOpenChat = () => {
    openChat();
    setFocusToken((value) => value + 1);
  };

  if (!chatOpen) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-10">
        <div className="group relative h-80 w-80 sm:h-96 sm:w-96">
          <RefreshCw
            aria-hidden="true"
            strokeWidth={1.25}
            className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 animate-[spin_18s_linear_infinite] text-primary/40"
          />

          <div className="absolute left-1/2 top-[17%] w-24 -translate-x-1/2 -translate-y-1/2 sm:w-28">
            <AgentMascot src={monitoringAgent} name={t('agentMonitoring')} className="mascot-jump" />
          </div>
          <div className="absolute left-[21.4%] top-[66.5%] w-24 -translate-x-1/2 -translate-y-1/2 sm:w-28">
            <AgentMascot src={inventoryAgent} name={t('agentInventory')} className="mascot-jump" />
          </div>
          <div className="absolute left-[78.6%] top-[66.5%] w-24 -translate-x-1/2 -translate-y-1/2 sm:w-28">
            <AgentMascot src={shoppingAgent} name={t('agentShopping')} className="mascot-jump" />
          </div>

          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={handleOpenChat}
              aria-label={t('startConversation')}
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg sm:h-20 sm:w-20',
                'transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              )}
            >
              <Plus size={32} />
            </button>
            <span className="w-24 text-center text-[10px] font-medium leading-tight text-muted">
              {t('startConversation')}
            </span>
          </div>
        </div>

        <p className="text-center text-2xl font-semibold text-ink sm:text-3xl">
          {t('homeSubtitle')}
        </p>

        <img src={logo} alt={t('appName')} className="w-40 sm:w-48" draggable={false} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line bg-surface px-4 py-2">
        <div>
          <button
            type="button"
            onClick={closeChat}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={16} />
            {t('back')}
          </button>
        </div>

        <div className="group flex items-center gap-3">
          {chatAgents.map((agent) => (
            <div key={agent.name} className="w-11">
              <AgentMascot src={agent.src} name={agent.name} className="mascot-jump" />
            </div>
          ))}
        </div>

        <div />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
          {messages.length === 0 ? (
            <p className="mt-6 text-center text-sm text-muted">{t('composerPlaceholder')}</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[80%] overflow-hidden rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-white">
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt=""
                      className="mb-2 max-h-56 w-full rounded-lg object-cover"
                    />
                  )}
                  {message.text && (
                    <p dir="auto" className="whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-line bg-surface px-4 py-3">
        <div className="mx-auto w-full max-w-2xl">
          <ChatComposer onSubmit={handleSubmit} focusToken={focusToken} />
        </div>
      </div>
    </div>
  );
}
