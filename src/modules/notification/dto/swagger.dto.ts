import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from 'database/enums';
import { NotificationResponseDto } from './response.dto';

export class RegisterPushTokenRequestSwaggerDto {
  @ApiProperty({ example: 'fCMDeviceTokenExample1234567890' })
  token: string;

  @ApiProperty({ example: 'web' })
  platform: string;
}

export class RemovePushTokenRequestSwaggerDto {
  @ApiProperty({ example: 'fCMDeviceTokenExample1234567890' })
  token: string;
}

export class PushTokenActionResponseSwaggerDto {
  @ApiProperty({ example: true })
  success: boolean;
}

export class NotificationResponseSwaggerDto implements NotificationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.BILL_REMINDER,
  })
  type: NotificationType;

  @ApiProperty({ example: 'Bill Reminder' })
  title: string;

  @ApiProperty({
    nullable: true,
    example: 'Bill "Internet" is due in 24 hours',
  })
  body: string | null;

  @ApiProperty({ nullable: true, example: 'BILL' })
  entityType: string | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  entityId: string | null;

  @ApiProperty({
    type: 'object',
    nullable: true,
    additionalProperties: true,
    example: { amount: '120.00', dueDate: '2026-03-01' },
  })
  data: Record<string, unknown> | null;

  @ApiProperty({ example: '2026-02-26T10:00:00.000Z' })
  sentAt: Date;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ nullable: true, example: null })
  readAt: Date | null;

  @ApiProperty({ example: '2026-02-26T10:00:00.000Z' })
  createdAt: Date;
}
