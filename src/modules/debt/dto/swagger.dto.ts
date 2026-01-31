import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDebtDto, UpdateDebtDto, FilterDebtDto } from './request.dto';
import { DebtResponseDto } from './response.dto';
import { DebtDirection, DebtStatus } from 'database/enums';

// ---------- Requests ----------

export class CreateDebtRequestSwaggerDto implements CreateDebtDto {
  @ApiProperty({ example: 'Ahmad Hassan', minLength: 1, maxLength: 160 })
  personalName: string;

  @ApiProperty({ enum: DebtDirection, example: DebtDirection.I_OWE })
  direction: DebtDirection;

  @ApiProperty({ example: '1500.00', description: 'Amount as decimal string' })
  amount: string;

  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  currencyId: string;

  @ApiProperty({ example: '2026-03-15', type: 'string', format: 'date' })
  dueDate: string;

  @ApiPropertyOptional({ example: 'Loan for car repair', nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ example: false, default: false })
  reminderEnabled?: boolean;

  @ApiPropertyOptional({
    example: '2026-03-10T09:00:00.000Z',
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  remindAt?: Date | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  assetId?: string | null;
}

export class UpdateDebtRequestSwaggerDto implements UpdateDebtDto {
  @ApiPropertyOptional({ example: 'Ahmad Hassan' })
  personalName?: string;

  @ApiPropertyOptional({ example: '2000.00' })
  amount?: string;

  @ApiPropertyOptional({
    example: '2026-04-15',
    type: 'string',
    format: 'date',
  })
  dueDate?: string;

  @ApiPropertyOptional({ example: 'Updated description', nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ enum: DebtStatus, example: DebtStatus.PAID })
  status?: DebtStatus;

  @ApiPropertyOptional({ example: true })
  reminderEnabled?: boolean;

  @ApiPropertyOptional({
    example: '2026-03-10T09:00:00.000Z',
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  remindAt?: Date | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  assetId?: string | null;
}

export class FilterDebtRequestSwaggerDto implements FilterDebtDto {
  @ApiPropertyOptional({ enum: DebtDirection, example: DebtDirection.I_OWE })
  direction?: DebtDirection;

  @ApiPropertyOptional({ enum: DebtStatus, example: DebtStatus.UNPAID })
  status?: DebtStatus;

  @ApiPropertyOptional({ format: 'uuid' })
  currencyId?: string;

  @ApiPropertyOptional({
    example: '2026-01-01',
    type: 'string',
    format: 'date',
  })
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    type: 'string',
    format: 'date',
  })
  endDate?: string;
}

// ---------- Responses ----------

export class DebtResponseSwaggerDto implements DebtResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  userId: string;

  @ApiProperty({ example: 'Ahmad Hassan' })
  personalName: string;

  @ApiProperty({ enum: DebtDirection, example: DebtDirection.I_OWE })
  direction: DebtDirection;

  @ApiProperty({ example: '1500.00' })
  amount: string;

  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  currencyId: string;

  @ApiProperty({ example: '2026-03-15' })
  dueDate: string;

  @ApiProperty({ example: 'Loan for car repair', nullable: true })
  description: string | null;

  @ApiProperty({ enum: DebtStatus, example: DebtStatus.UNPAID })
  status: DebtStatus;

  @ApiProperty({ example: false })
  reminderEnabled: boolean;

  @ApiProperty({ example: '2026-03-10T09:00:00.000Z', nullable: true })
  remindAt: Date | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  assetId: string | null;

  @ApiProperty({ example: '2026-01-30T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-30T10:00:00.000Z' })
  updatedAt: Date;
}
