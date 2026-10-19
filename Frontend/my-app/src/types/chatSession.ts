import type { AgentType, NotificationStatus } from '@/types/enums';
import type { ChatDto } from '@/types/chat';

export interface ChatTimelineUserItem {
  kind: 'user';
  id: string;
  message: string;
  imageUrl?: string | null;
  imageType?: string | null;
  createdAt: string;
}

export interface ChatExecutionGroup {
  kind: 'execution';
  id: string;
  agentType: AgentType | null;
  status: NotificationStatus | null;
  messages: ChatDto[];
  startedAt: string;
  updatedAt: string;
}

export type ChatTimelineItem = ChatTimelineUserItem | ChatExecutionGroup;
