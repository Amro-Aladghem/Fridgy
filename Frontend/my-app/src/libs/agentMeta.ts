import inventoryAgent from '@/assets/InventoryAgent.png';
import monitoringAgent from '@/assets/MonitoringAgent.png';
import shoppingAgent from '@/assets/ShoppingAgent.png';
import type { AgentType } from '@/types/enums';
import type { TranslationKey } from '@/contexts/LanguageContext';

interface AgentMeta {
  src: string;
  labelKey: TranslationKey;
}

export const agentMeta: Record<AgentType, AgentMeta> = {
  InventoryAgent: { src: inventoryAgent, labelKey: 'agentInventory' },
  MonitoringAgent: { src: monitoringAgent, labelKey: 'agentMonitoring' },
  ShoppingAgent: { src: shoppingAgent, labelKey: 'agentShopping' },
  CookingAgent: { src: monitoringAgent, labelKey: 'agentCooking' },
};

export const fallbackAgentMeta: AgentMeta = {
  src: inventoryAgent,
  labelKey: 'agentGeneric',
};
