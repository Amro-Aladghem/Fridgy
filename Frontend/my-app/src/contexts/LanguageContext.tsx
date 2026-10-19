import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

const en = {
  appName: 'Fridgy AI',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  menu: 'Menu',
  back: 'Back',

  navHome: 'Home',
  navFridge: 'Fridge',
  navShoppingLists: 'Shopping Lists',
  navMonitoring: 'Monitoring',

  notifications: 'Notifications',
  markAllRead: 'Mark all as read',
  noNotifications: 'No notifications yet',
  noNotificationsHint: 'You are all caught up.',
  unread: 'Unread',
  close: 'Close',

  loading: 'Loading…',
  errorTitle: 'Something went wrong',
  retry: 'Retry',

  homeSubtitle: 'Fridgy Agents Work For You',
  startConversation: 'Start a new conversation',
  composerPlaceholder: 'Ask about your fridge, food, shopping list, or recipes…',
  send: 'Send',
  voiceInput: 'Voice input',
  voiceUnavailable: 'Voice input is not available yet.',
  attachImage: 'Attach image',
  messagesPreview: 'Your messages',
  chatStatusQueued: 'Queued',
  chatStatusRunning: 'Working…',
  chatStatusWaitingUser: 'Waiting for you',
  chatStatusFinished: 'Finished',
  chatStatusFailed: 'Failed',
  chatStartFailed: 'Could not start a new chat.',

  fridgeTitle: 'Your Fridge',
  fridgeSubtitle: 'Tap the fridge to open the door.',
  fridgeOpenHint: 'Tap the door to close it.',
  emptyFridge: 'Your fridge is empty',
  emptyFridgeHint: 'Add products through a conversation and they will show up here.',

  productDetails: 'Product details',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
  name: 'Name',
  description: 'Description',
  quantity: 'Quantity',
  amount: 'Amount',
  price: 'Price',
  producedDate: 'Production date',
  expiryDate: 'Expiration date',
  status: 'Status',
  notSet: 'Not set',
  expiryNotSet: 'No expiration date has been set for this product.',
  setExpiryDate: 'Set expiration date',
  invalidDate: 'Please enter a valid date.',
  expiryRequired: 'Please choose an expiration date.',
  expiryInPast: 'This date is in the past.',

  statusFresh: 'Fresh',
  statusApproaching: 'Expiring soon',
  statusExpired: 'Expired',
  statusUnknown: 'Unknown expiry',

  shoppingTitle: 'Shopping Lists',
  shoppingSubtitle: 'Plan and track your purchases.',
  items: 'items',
  purchasedCount: 'purchased',
  noShoppingLists: 'No shopping lists yet',
  noShoppingListsHint: 'Shopping lists created by the agent will appear here.',
  listEmpty: 'This list has no items.',
  openList: 'Open list',
  createdOn: 'Created',
  moreInfo: 'More info',
  purchased: 'Purchased',
  pending: 'To buy',
  togglePurchased: 'Toggle purchased',

  monitoringTitle: 'Monitoring',
  monitoringSubtitle: 'An overview of expiration and status.',
  monAll: 'Inventory Products',
  monExpired: 'Expired Products',
  monSoon: 'Soon Expired / Finishing',
  monFinished: 'Finished Products',
  nothingHere: 'Nothing here.',

  agentInventory: 'Inventory Agent',
  agentMonitoring: 'Monitoring Agent',
  agentShopping: 'Shopping Agent',
  agentCooking: 'Cooking Agent',
  agentGeneric: 'Agent',
} as const;

export type TranslationKey = keyof typeof en;

interface LanguageContextValue {
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = useMemo<LanguageContextValue>(
    () => ({ t: (key: TranslationKey) => en[key] }),
    [],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
