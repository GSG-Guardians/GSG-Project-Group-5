import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'database/entities/notifications.entities';
import { NotificationType } from 'database/enums';
import { Repository } from 'typeorm';
import { RegisterPushTokenDto } from './dto/request.dto';
import { PushNotificationService } from './push-notification.service';

type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  data?: Record<string, unknown> | null;
};

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      data: input.data ?? null,
      isRead: false,
      readAt: null,
    });

    const saved = await this.notificationRepository.save(notification);

    if (input.body) {
      await this.pushNotificationService.sendToUser({
        userId: input.userId,
        title: input.title,
        body: input.body,
        data: {
          notificationId: saved.id,
          type: input.type,
          entityType: input.entityType,
          entityId: input.entityId,
          ...(input.data ?? {}),
        },
      });
    }

    return saved;
  }

  async registerPushToken(userId: string, dto: RegisterPushTokenDto) {
    await this.pushNotificationService.registerToken(
      userId,
      dto.token,
      dto.platform,
    );
  }

  async removePushToken(userId: string, token: string) {
    await this.pushNotificationService.removeToken(userId, token);
  }
}
