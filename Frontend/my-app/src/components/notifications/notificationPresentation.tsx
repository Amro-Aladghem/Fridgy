import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ChefHat,
  Clock,
  Loader2,
  MessageCircle,
  ShoppingCart,
} from 'lucide-react';
import type { TranslationKey } from '@/contexts/LanguageContext';
import type { AgentType, NotificationStatus } from '@/types/enums';

interface AgentPresentation {
  Icon: LucideIcon;
  tint: string;
  labelKey: TranslationKey;
}

export const agentPresentation: Record<AgentType, AgentPresentation> = {
  InventoryAgent: { Icon: Boxes, tint: 'bg-mint text-primary-dark', labelKey: 'agentInventory' },
  MonitoringAgent: { Icon: Activity, tint: 'bg-warn-soft text-warn', labelKey: 'agentMonitoring' },
  ShoppingAgent: { Icon: ShoppingCart, tint: 'bg-blue-50 text-blue-700', labelKey: 'agentShopping' },
  CookingAgent: { Icon: ChefHat, tint: 'bg-purple-50 text-purple-700', labelKey: 'agentCooking' },
};

interface StatusPresentation {
  Icon: LucideIcon;
  tint: string;
  spin?: boolean;
}

export const statusPresentation: Record<NotificationStatus, StatusPresentation> = {
  Queued: { Icon: Clock, tint: 'text-muted' },
  Running: { Icon: Loader2, tint: 'text-primary', spin: true },
  WaitingForUser: { Icon: MessageCircle, tint: 'text-warn' },
  Completed: { Icon: CheckCircle2, tint: 'text-primary' },
  Failed: { Icon: AlertTriangle, tint: 'text-danger' },
};

export const statusLabelKey: Record<NotificationStatus, TranslationKey> = {
  Queued: 'chatStatusQueued',
  Running: 'chatStatusRunning',
  WaitingForUser: 'chatStatusWaitingUser',
  Completed: 'chatStatusFinished',
  Failed: 'chatStatusFailed',
};
