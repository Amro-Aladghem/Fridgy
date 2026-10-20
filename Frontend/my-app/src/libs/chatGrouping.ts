import type { AgentType, NotificationStatus } from '@/types/enums';
import type { ChatDto } from '@/types/chat';
import type { NotificationDto } from '@/types/notification';
import type { ProductDto } from '@/types/product';
import type {
  ChatExecutionGroup,
  ChatTimelineItem,
  ChatTimelineUserItem,
} from '@/types/chatSession';

const USER_CHAT_ROLE_ID = 4;
const MONITOR_CHAT_ROLE_ID = 2;

const roleToAgentType: Record<number, AgentType> = {
  1: 'InventoryAgent',
  3: 'ShoppingAgent',
};

const ACTIVE_STATUSES: NotificationStatus[] = [
  'Queued',
  'Running',
  'WaitingForUser',
];

function timeValue(value?: string | null): number {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

interface MutableGroup extends ChatExecutionGroup {
  closed: boolean;
}

interface NotificationRun {
  agentType: AgentType;
  status: NotificationStatus;
  startedAt: string;
  updatedAt: string;
}

function buildRuns(notifications: NotificationDto[]): NotificationRun[] {
  const ordered = [...notifications].sort((a, b) => {
    const diff = timeValue(a.updatedAt) - timeValue(b.updatedAt);
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });

  const runs: NotificationRun[] = [];
  let current: NotificationRun | null = null;

  for (const notification of ordered) {
    if (notification.agentType === 'MonitoringAgent') continue;

    if (
      current === null ||
      notification.notificationStatus === 'Queued' ||
      current.agentType !== notification.agentType
    ) {
      current = {
        agentType: notification.agentType,
        status: notification.notificationStatus,
        startedAt: notification.updatedAt,
        updatedAt: notification.updatedAt,
      };
      runs.push(current);
    } else {
      current.status = notification.notificationStatus;
      current.updatedAt = notification.updatedAt;
    }
  }

  return runs;
}

function findActiveRun(runs: NotificationRun[]): NotificationRun | null {
  const last = runs[runs.length - 1];
  if (!last) return null;
  return ACTIVE_STATUSES.includes(last.status) ? last : null;
}

export function buildChatTimeline(
  history: ChatDto[],
  notifications: NotificationDto[],
): ChatTimelineItem[] {
  const timeline: ChatTimelineItem[] = [];
  const groups: MutableGroup[] = [];
  let current: MutableGroup | null = null;

  for (const [index, message] of history.entries()) {
    if (message.showMessage !== true) continue;
    if (message.chatRoleId === MONITOR_CHAT_ROLE_ID) continue;

    if (message.chatRoleId === USER_CHAT_ROLE_ID) {
      current = null;
      const item: ChatTimelineUserItem = {
        kind: 'user',
        id: `user-${index}-${message.creationTime}`,
        message: message.message,
        imageUrl: message.imageUrl,
        imageType: message.imageType,
        createdAt: message.creationTime,
      };
      timeline.push(item);
      continue;
    }

    const agentType = roleToAgentType[message.chatRoleId];
    if (agentType === undefined) continue;

    if (current === null || current.agentType !== agentType || current.closed) {
      const group: MutableGroup = {
        kind: 'execution',
        id: `exec-${index}-${message.creationTime}`,
        agentType,
        status: null,
        messages: [message],
        startedAt: message.creationTime,
        updatedAt: message.creationTime,
        closed: message.isFinalResponse === true,
      };
      current = group;
      groups.push(group);
      timeline.push(group);
    } else {
      current.messages.push(message);
      current.updatedAt = message.creationTime;
      if (message.isFinalResponse === true) current.closed = true;
    }
  }

  for (const group of groups) {
    if (group.closed) group.status = 'Completed';
  }

  const run = findActiveRun(buildRuns(notifications));
  if (run) {
    const status: NotificationStatus =
      run.status === 'WaitingForUser' ? 'WaitingForUser' : 'Running';

    if (current && !current.closed && current.agentType === run.agentType) {
      current.status = status;
    } else {
      timeline.push({
        kind: 'execution',
        id: `run-${run.startedAt}-${run.agentType}`,
        agentType: run.agentType,
        status,
        messages: [],
        startedAt: run.startedAt,
        updatedAt: run.updatedAt,
      });
    }
  }

  return timeline;
}

export function resolveMessageText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return raw;
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'Message' in parsed &&
      typeof (parsed as { Message?: unknown }).Message === 'string'
    ) {
      return (parsed as { Message: string }).Message;
    }
  } catch {
    return raw;
  }
  return raw;
}

function toProductDto(value: unknown): ProductDto | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const name = asString(raw.name ?? raw.Name);
  if (!name) return null;
  return {
    id: asString(raw.id ?? raw.Id),
    inventoryId: asString(raw.inventoryId ?? raw.InventoryId) ?? '',
    name,
    description: asString(raw.description ?? raw.Description),
    quantity: asNumber(raw.quantity ?? raw.Quantity) ?? 0,
    price: asNumber(raw.price ?? raw.Price),
    imageUrl: asString(raw.imageUrl ?? raw.ImageUrl),
    productStatusId: asNumber(raw.productStatusId ?? raw.ProductStatusId) ?? 0,
    producedDate: asString(raw.producedDate ?? raw.ProducedDate),
    expiryDate: asString(raw.expiryDate ?? raw.ExpiryDate),
    creationDate: asString(raw.creationDate ?? raw.CreationDate),
  };
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

export function parseProductData(data?: string | null): ProductDto[] {
  if (!data) return [];
  const trimmed = data.trim();
  if (!trimmed.startsWith('[')) return [];
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(toProductDto)
      .filter((product): product is ProductDto => product !== null);
  } catch {
    return [];
  }
}
