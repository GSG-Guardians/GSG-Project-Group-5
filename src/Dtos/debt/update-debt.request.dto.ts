import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { DebtType } from 'src/enums/debt-type.enum';

export class UpdateDebtRequestDto {
  @ApiProperty({
    example: 'Ahmad Ali',
    description: 'Name of the person/friend for this debt',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  person_name?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL for the person',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  avatar_url?: string;

  @ApiProperty({
    example: 500.0,
    description: 'Debt amount',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0.01)
  amount?: number;

  @ApiProperty({
    example: '2026-02-15',
    description: 'Due date for the debt (ISO date format)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiProperty({
    example: 'Payment for dinner at restaurant',
    description: 'Description of the debt',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: PaymentStatus.PAID,
    description: 'Payment status',
    enum: PaymentStatus,
    required: false,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;

  @ApiProperty({
    example: DebtType.INDIVIDUAL,
    description: 'Type of debt (individual or group)',
    enum: DebtType,
    required: false,
  })
  @IsEnum(DebtType)
  @IsOptional()
  debt_type?: DebtType;

  @ApiProperty({
    example: true,
    description: 'Enable reminder for this debt',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  reminder_enabled?: boolean;

  @ApiProperty({
    example: '2026-02-10T10:00:00Z',
    description: 'Reminder date and time (ISO timestamp)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  reminder_date?: string;

  @ApiProperty({
    example: 'Weekend Trip Group',
    description: 'Group name if debt_type is GROUP',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  group_name?: string;

  @ApiProperty({
    example: 5,
    description: 'Number of members in the group',
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  group_members_count?: number;
}
