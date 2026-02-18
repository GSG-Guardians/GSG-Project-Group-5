import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncomeFrequency, IncomeSource } from 'database/enums';
import type {
  CreateIncomeDto,
  CreateIncomeRecurringDto,
  FilterIncomeDto,
  UpdateIncomeDto,
} from './request.dto';
import { IncomeResponseDto } from './response.dto';

export class CreateIncomeRecurringRequestSwaggerDto implements CreateIncomeRecurringDto {
  @ApiProperty({ enum: IncomeFrequency, example: IncomeFrequency.MONTHLY })
  frequency: IncomeFrequency;

  @ApiPropertyOptional({
    example: '2026-12-31',
    type: 'string',
    format: 'date',
    nullable: true,
  })
  endAt?: string | null;
}

export class CreateIncomeRequestSwaggerDto implements CreateIncomeDto {
  @ApiProperty({ example: '1500.00', description: 'Amount as decimal string' })
  amount: string;

  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  currencyId: string;

  @ApiProperty({ enum: IncomeSource, example: IncomeSource.SALARY })
  source: IncomeSource;

  @ApiPropertyOptional({ example: 'Monthly salary', nullable: true })
  description?: string | null;

  @ApiProperty({ example: '2026-02-01', type: 'string', format: 'date' })
  incomeDate: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  assetId?: string | null;

  @ApiPropertyOptional({ type: CreateIncomeRecurringRequestSwaggerDto })
  recurring?: CreateIncomeRecurringRequestSwaggerDto;
}

export class UpdateIncomeRequestSwaggerDto implements UpdateIncomeDto {
  @ApiPropertyOptional({ example: '1800.00' })
  amount?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  currencyId?: string;

  @ApiPropertyOptional({ enum: IncomeSource, example: IncomeSource.FREELANCE })
  source?: IncomeSource;

  @ApiPropertyOptional({ example: 'Updated income note', nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ example: '2026-02-02', format: 'date' })
  incomeDate?: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  assetId?: string | null;
}

export class FilterIncomeRequestSwaggerDto implements FilterIncomeDto {
  @ApiPropertyOptional({ enum: IncomeSource, example: IncomeSource.SALARY })
  source?: IncomeSource;

  @ApiPropertyOptional({ format: 'uuid' })
  currencyId?: string;

  @ApiPropertyOptional({ example: '2026-01-01', format: 'date' })
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31', format: 'date' })
  endDate?: string;
}

export class IncomeResponseSwaggerDto implements IncomeResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ example: '1500.00' })
  amount: string;

  @ApiProperty({ format: 'uuid' })
  currencyId: string;

  @ApiProperty({ enum: IncomeSource, example: IncomeSource.SALARY })
  source: IncomeSource;

  @ApiProperty({ example: 'Monthly salary', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2026-02-01', format: 'date' })
  incomeDate: string;

  @ApiProperty({ format: 'uuid', nullable: true })
  assetId: string | null;

  @ApiProperty({ example: '2026-02-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-01T10:00:00.000Z' })
  updatedAt: Date;
}

export class IncomeSummaryResponseSwaggerDto {
  @ApiProperty({ example: '12000.00' })
  totalIncome: string;

  @ApiProperty({ example: 8 })
  count: number;
}
