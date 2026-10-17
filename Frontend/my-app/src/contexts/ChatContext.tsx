import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface ChatContextValue {
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  const value = useMemo<ChatContextValue>(
    () => ({
      chatOpen,
      openChat: () => setChatOpen(true),
      closeChat: () => setChatOpen(false),
    }),
    [chatOpen],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}
