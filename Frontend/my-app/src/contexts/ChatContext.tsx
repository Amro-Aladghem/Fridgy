import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import inventoryService from '@/services/inventoryService';
import { INVENTORY_ID } from '@/libs/config';
import { buildChatTimeline } from '@/libs/chatGrouping';
import { ChatRole } from '@/types/enums';
import type { AgentType, NotificationStatus } from '@/types/enums';
import type { ChatDto } from '@/types/chat';
import type { NotificationDto } from '@/types/notification';
import type { ChatTimelineItem, ChatTimelineUserItem } from '@/types/chatSession';

const STORAGE_KEY = 'fridgy.chatId';
const POLL_INTERVAL_MS = 5000;
const FRESH_MESSAGE_AGENT_HINT: AgentType = 'InventoryAgent';

const TERMINAL_STATUSES: NotificationStatus[] = [
  'WaitingForUser',
  'Completed',
  'Failed',
];

interface ChatContextValue {
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  chatId: string | null;
  timeline: ChatTimelineItem[];
  notifications: NotificationDto[];
  loading: boolean;
  creating: boolean;
  sending: boolean;
  hasMessages: boolean;
  hasImage: boolean;
  startNewChat: () => Promise<void>;
  sendMessage: (text: string, file: File | null) => Promise<void>;
  reload: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function readStoredChatId(): string | null {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    return value && value.trim().length > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeStoredChatId(value: string): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore storage failures
  }
}

function serialize(value: unknown): string {
  return JSON.stringify(value);
}

function orderedNotifications(notifications: NotificationDto[]): NotificationDto[] {
  return [...notifications].sort((a, b) => {
    const diff = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });
}

function latestStatus(notifications: NotificationDto[]): NotificationStatus | null {
  const ordered = orderedNotifications(notifications);
  return ordered.length > 0 ? ordered[ordered.length - 1].notificationStatus : null;
}

function waitingAgentType(notifications: NotificationDto[]): AgentType | null {
  const ordered = orderedNotifications(notifications);
  const last = ordered[ordered.length - 1];
  return last && last.notificationStatus === 'WaitingForUser' ? last.agentType : null;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState<boolean>(() => readStoredChatId() !== null);
  const [chatId, setChatId] = useState<string | null>(() => readStoredChatId());
  const [history, setHistory] = useState<ChatDto[]>([]);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [pending, setPending] = useState<ChatTimelineUserItem[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const creatingRef = useRef(false);
  const notificationsJsonRef = useRef<string>('');

  const loading = chatId !== null && loadedKey !== chatId;

  const timeline = useMemo(() => {
    const base = buildChatTimeline(history, notifications);
    return pending.length > 0 ? [...base, ...pending] : base;
  }, [history, notifications, pending]);

  const hasMessages = timeline.length > 0;
  const hasImage = useMemo(
    () => history.some((item) => Boolean(item.imageUrl)),
    [history],
  );
  const lastStatus = useMemo(() => latestStatus(notifications), [notifications]);

  useEffect(() => {
    if (!chatId) return;
    let active = true;
    const key = chatId;

    void Promise.all([
      inventoryService.getChatsHistoryById(INVENTORY_ID, key),
      inventoryService.getNotificationsForChat(INVENTORY_ID, key),
    ])
      .then(([historyResult, notificationsResult]) => {
        if (!active) return;
        const notificationsData = notificationsResult.isSuccess ? notificationsResult.data : [];
        notificationsJsonRef.current = serialize(notificationsData);
        setHistory(historyResult.isSuccess ? historyResult.data : []);
        setNotifications(notificationsData);
        setLoadedKey(key);
      })
      .catch(() => {
        if (!active) return;
        notificationsJsonRef.current = '[]';
        setHistory([]);
        setNotifications([]);
        setLoadedKey(key);
      });

    return () => {
      active = false;
    };
  }, [chatId, refreshToken]);

  useEffect(() => {
    if (!chatOpen || !chatId || !hasMessages) return;
    if (lastStatus !== null && TERMINAL_STATUSES.includes(lastStatus)) return;

    let cancelled = false;
    let inFlight = false;

    const run = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const result = await inventoryService.getNotificationsForChat(INVENTORY_ID, chatId);
        if (cancelled || !result.isSuccess) return;

        const serialized = serialize(result.data);
        if (serialized === notificationsJsonRef.current) return;
        notificationsJsonRef.current = serialized;
        setNotifications(result.data);

        const status = latestStatus(result.data);
        if (
          status === 'WaitingForUser' ||
          status === 'Completed' ||
          status === 'Failed'
        ) {
          const historyResult = await inventoryService.getChatsHistoryById(INVENTORY_ID, chatId);
          if (!cancelled && historyResult.isSuccess) setHistory(historyResult.data);
        }
      } catch {
        // polling failures are intentionally silent
      } finally {
        inFlight = false;
      }
    };

    const interval = window.setInterval(() => {
      void run();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [chatOpen, chatId, hasMessages, lastStatus]);

  const startNewChat = useCallback(async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    setCreating(true);
    try {
      const signature = crypto.randomUUID();
      const result = await inventoryService.createChatForInventory(INVENTORY_ID, {
        chatSignature: signature,
        inventoryId: INVENTORY_ID,
        creationTime: new Date().toISOString(),
        chatRoleId: ChatRole.User,
        message: '',
        data: null,
        showMessage: false,
        isFinalResponse: false,
      });

      if (result.isSuccess && result.data?.chatSignature) {
        const id = result.data.chatSignature;
        writeStoredChatId(id);
        notificationsJsonRef.current = '[]';
        setHistory([]);
        setNotifications([]);
        setPending([]);
        setLoadedKey(id);
        setChatId(id);
      }
    } catch {
      // keep the UI in a valid state so the user can retry
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  }, []);

  const openChat = useCallback(() => {
    setChatOpen(true);
    if (chatId) return;
    const stored = readStoredChatId();
    if (stored) {
      setChatId(stored);
      return;
    }
    void startNewChat();
  }, [chatId, startNewChat]);

  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  const reload = useCallback(() => {
    setRefreshToken((value) => value + 1);
  }, []);

  const sendMessage = useCallback(
    async (text: string, file: File | null) => {
      const message = text.trim();
      if (!message && !file) return;
      if (!chatId || sending) return;

      const pendingId = `pending-${crypto.randomUUID()}`;
      const imagePreview = file ? URL.createObjectURL(file) : null;
      setPending((prev) => [
        ...prev,
        {
          kind: 'user',
          id: pendingId,
          message,
          imageUrl: imagePreview,
          imageType: file?.type ?? null,
          createdAt: new Date().toISOString(),
        },
      ]);

      setSending(true);
      try {
        const agent = waitingAgentType(notifications);

        let imageUri: string | null = null;
        if (file) {
          const upload = await inventoryService.uploadInventoryImage(INVENTORY_ID, file);
          if (!upload.isSuccess) {
            setPending((prev) => prev.filter((item) => item.id !== pendingId));
            return;
          }
          imageUri = upload.data;
        }

        const result = await inventoryService.chatWithAgent(
          INVENTORY_ID,
          chatId,
          {
            chatSignture: chatId,
            inventoryId: INVENTORY_ID,
            message,
            imageUri,
            agentType: agent ?? FRESH_MESSAGE_AGENT_HINT,
          },
          agent !== null,
        );

        setPending((prev) => prev.filter((item) => item.id !== pendingId));
        if (result.isSuccess) reload();
      } catch {
        setPending((prev) => prev.filter((item) => item.id !== pendingId));
      } finally {
        setSending(false);
      }
    },
    [chatId, sending, notifications, reload],
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      chatOpen,
      openChat,
      closeChat,
      chatId,
      timeline,
      notifications,
      loading,
      creating,
      sending,
      hasMessages,
      hasImage,
      startNewChat,
      sendMessage,
      reload,
    }),
    [
      chatOpen,
      openChat,
      closeChat,
      chatId,
      timeline,
      notifications,
      loading,
      creating,
      sending,
      hasMessages,
      hasImage,
      startNewChat,
      sendMessage,
      reload,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}
