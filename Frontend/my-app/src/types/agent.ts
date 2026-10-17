import type { AgentType } from '@/types/enums';

export interface AgentRequestDto {
  chatSignture?: string | null;
  inventoryId: string;
  message: string;
  imageUri?: string | null;
  agentType?: AgentType | null;
}
