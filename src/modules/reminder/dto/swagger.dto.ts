import { ApiProperty } from '@nestjs/swagger';
import { ReminderFrequency } from 'database/enums';
import { ReminderResponseDto } from './response.dto';

export class ReminderResponseSwaggerDto implements ReminderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ format: 'date', example: '2026-03-01' })
  dueDate: string;

  @ApiProperty({
    nullable: true,
    example: 'Bill "Internet" is due in 24 hours',
  })
  description: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ enum: ReminderFrequency, example: ReminderFrequency.NONE })
  frequency: ReminderFrequency;

  @ApiProperty({ nullable: true, example: '2026-03-01T00:00:00.000Z' })
  nextRemindAt: Date | null;

  @ApiProperty({ nullable: true, example: null })
  lastSentAt: Date | null;

  @ApiProperty({ nullable: true, example: null })
  completedAt: Date | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  debtId: string | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  billId: string | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  expenseId: string | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  groupInvoiceId: string | null;

  @ApiProperty({ example: '2026-02-26T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-26T10:00:00.000Z' })
  updatedAt: Date;
}
