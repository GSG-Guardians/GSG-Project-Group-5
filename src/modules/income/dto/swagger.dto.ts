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
  @ApiProperty({ example: 9300 })
  totalIncome: number;

  @ApiProperty({ example: 12 })
  percentChangeVsPreviousPeriod: number;

  @ApiProperty({
    enum: IncomeSource,
    nullable: true,
    example: IncomeSource.SALARY,
  })
  topSource: IncomeSource | null;

  @ApiProperty({ example: 7250 })
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

export class IncomeBreakdownItemSwaggerDto {
  @ApiProperty({ enum: IncomeSource, example: IncomeSource.SALARY })
  source: IncomeSource;

  @ApiProperty({ example: 3500 })
  amount: number;

  @ApiProperty({ example: 70 })
  percentage: number;
}

export class IncomeBreakdownSwaggerDto {
  @ApiProperty({ example: 5000 })
  totalIncome: number;

  @ApiProperty({ type: [IncomeBreakdownItemSwaggerDto] })
  items: IncomeBreakdownItemSwaggerDto[];
}
export class IncomePeriodQuerySwaggerDto {
  @ApiPropertyOptional({
    enum: ['week', 'month', 'year'],
    default: 'month',
    description: 'Time period for income aggregation',
  })
  period?: 'week' | 'month' | 'year';
}
