import type { AgentType, NotificationStatus } from '@/types/enums';

export interface NotificationDto {
  id: string;
  inventoryId: string;
  chatId: string;
  text: string;
  notificationStatus: NotificationStatus;
  agentType: AgentType;
  data?: string | null;
  updatedAt: string;
}
