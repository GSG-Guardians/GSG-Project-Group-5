import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { DebtType } from 'src/enums/debt-type.enum';

export class DebtResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the debt',
  })
  id: string;

  @ApiProperty({
    example: 'Ahmad Ali',
    description: 'Name of the person/friend for this debt',
  })
  person_name: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL for the person',
    required: false,
  })
  avatar_url?: string;

  @ApiProperty({
    example: 500.0,
    description: 'Debt amount',
  })
  amount: number;

  @ApiProperty({
    example: '2026-02-15',
    description: 'Due date for the debt',
  })
  due_date: Date;

  @ApiProperty({
    example: 'Payment for dinner at restaurant',
    description: 'Description of the debt',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: PaymentStatus.UNPAID,
    description: 'Payment status',
    enum: PaymentStatus,
  })
  payment_status: PaymentStatus;

  @ApiProperty({
    example: DebtType.INDIVIDUAL,
    description: 'Type of debt (individual or group)',
    enum: DebtType,
  })
  debt_type: DebtType;

  @ApiProperty({
    example: true,
    description: 'Whether reminder is enabled',
  })
  reminder_enabled: boolean;

  @ApiProperty({
    example: '2026-02-10T10:00:00Z',
    description: 'Reminder date and time',
    required: false,
  })
  reminder_date?: Date;

  @ApiProperty({
    example: 'Weekend Trip Group',
    description: 'Group name if debt_type is GROUP',
    required: false,
  })
  group_name?: string;

  @ApiProperty({
    example: 5,
    description: 'Number of members in the group',
    required: false,
  })
  group_members_count?: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID who owns this debt',
  })
  user_id: string;

  @ApiProperty({
    example: '2026-01-26T10:00:00Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-26T10:00:00Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
