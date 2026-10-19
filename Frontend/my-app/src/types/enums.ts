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
  InventoryAgent: 1,
  MonitorAgent: 2,
  ShoppingListAgent: 3,
  User: 4,
  Tool: 5,
} as const;

export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];
