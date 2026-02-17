import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../../database/entities/notifications.entities';
import { PushToken } from '../../../database/entities/push-token.entities';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PushNotificationService } from './push-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, PushToken])],
  controllers: [NotificationController],
  providers: [NotificationService, PushNotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
