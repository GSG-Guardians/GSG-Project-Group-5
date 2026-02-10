import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncomeFrequency, IncomeSource } from '../../../../database/enums';

export class CreateIncomeSwaggerDto {
  @ApiProperty({ example: 1200 })
  amount: number;

  @ApiProperty({ example: 'uuid-currency-id' })
  currencyId: string;

  @ApiProperty({ enum: IncomeSource })
  source: IncomeSource;

  @ApiProperty({ example: '2026-02-01' })
  incomeDate: string;

  @ApiPropertyOptional({
    enum: IncomeFrequency,
    default: IncomeFrequency.ONE_TIME,
  })
  frequency?: IncomeFrequency;

  @ApiPropertyOptional({ example: 'Short note' })
  description?: string | null;

  @ApiPropertyOptional({ example: 'uuid-asset-id' })
  assetId?: string | null;

  @ApiPropertyOptional({ example: '2026-12-31' })
  endAt?: string | null;

  @ApiPropertyOptional({ example: true })
  isRecurringActive?: boolean;
}

export class UpdateIncomeSwaggerDto {
  @ApiPropertyOptional({ example: 1200 })
  amount?: number;

  @ApiPropertyOptional({ example: 'uuid-currency-id' })
  currencyId?: string;

  @ApiPropertyOptional({ enum: IncomeSource })
  source?: IncomeSource;

  @ApiPropertyOptional({ example: '2026-02-01' })
  incomeDate?: string;

  @ApiPropertyOptional({ enum: IncomeFrequency })
  frequency?: IncomeFrequency;

  @ApiPropertyOptional({ example: 'Short note' })
  description?: string | null;

  @ApiPropertyOptional({ example: 'uuid-asset-id' })
  assetId?: string | null;

  @ApiPropertyOptional({ example: '2026-12-31' })
  endAt?: string | null;

  @ApiPropertyOptional({ example: true })
  isRecurringActive?: boolean;
}

export class IncomeResponseSwaggerDto {
  @ApiProperty({ example: 'uuid-income-id' })
  id: string;

  @ApiProperty({ example: 1200 })
  amount: number;

  @ApiProperty({ example: 'uuid-currency-id' })
  currencyId: string;

  @ApiProperty({ enum: IncomeSource })
  source: IncomeSource;

  @ApiProperty({ example: '2026-02-01' })
  incomeDate: string;

  @ApiProperty({ enum: IncomeFrequency })
  frequency: IncomeFrequency;

  @ApiPropertyOptional({ example: 'Short note' })
  description: string | null;

  @ApiPropertyOptional({ example: 'uuid-asset-id' })
  assetId: string | null;

  @ApiProperty({ example: '2026-02-09T10:20:30.000Z' })
  createdAt: Date;
}

export class IncomeSummarySwaggerDto {
  @ApiProperty({ example: 3500 })
  totalIncome: number;

  @ApiProperty({ example: 12 })
  percentChangeVsPreviousPeriod: number;

  @ApiProperty({ example: IncomeSource.SALARY, enum: IncomeSource })
  topSource: IncomeSource;

  @ApiProperty({ example: 2800 })
  topSourceAmount: number;
}

export class IncomeListQuerySwaggerDto {
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  limit?: number;

  @ApiPropertyOptional({ example: '2026-02-01' })
  from?: string;

  @ApiPropertyOptional({ example: '2026-02-28' })
  to?: string;

  @ApiPropertyOptional({ enum: IncomeSource })
  source?: IncomeSource;
}
