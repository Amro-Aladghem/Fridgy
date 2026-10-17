export type AgentType =
  | 'InventoryAgent'
  | 'MonitoringAgent'
  | 'ShoppingAgent'
  | 'CookingAgent';

export type NotificationStatus =
  | 'Queued'
  | 'Running'
  | 'WaitingForUser'
  | 'Completed'
  | 'Failed';

export const ChatRole = {
  Agent: 1,
  User: 2,
  Tool: 3,
} as const;

export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];
