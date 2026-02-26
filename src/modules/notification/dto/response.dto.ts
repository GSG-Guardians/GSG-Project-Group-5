import { NotificationType } from 'database/enums';

export type NotificationResponseDto = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  entityType: string | null;
  entityId: string | null;
  data: Record<string, unknown> | null;
  sentAt: Date;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
};
