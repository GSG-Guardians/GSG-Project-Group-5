import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateBudgetDto,
  UpdateBudgetDto,
  FilterBudgetDto,
} from './request.dto';
import { BudgetResponseDto } from './response.dto';
import { BudgetCategory } from 'database/enums';

// ---------- Requests ----------

export class CreateBudgetRequestSwaggerDto implements CreateBudgetDto {
  @ApiProperty({ enum: BudgetCategory, example: BudgetCategory.FOOD })
  category: BudgetCategory;

  @ApiProperty({
    example: '500.00',
    description: 'Allocated amount as decimal string',
  })
  allocatedAmount: string;

  @ApiProperty({
    example: '2026-02-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  startDate: Date;

  @ApiProperty({
    example: '2026-02-28T23:59:59.999Z',
    type: 'string',
    format: 'date-time',
  })
  endDate: Date;

  @ApiPropertyOptional({ example: 'Monthly food budget', nullable: true })
  description?: string | null;
}

export class UpdateBudgetRequestSwaggerDto implements UpdateBudgetDto {
  @ApiPropertyOptional({ example: '600.00' })
  allocatedAmount?: string;

  @ApiPropertyOptional({
    example: '2026-02-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2026-02-28T23:59:59.999Z',
    type: 'string',
    format: 'date-time',
  })
  endDate?: Date;

  @ApiPropertyOptional({
    example: 'Updated budget description',
    nullable: true,
  })
  description?: string | null;
}

export class FilterBudgetRequestSwaggerDto implements FilterBudgetDto {
  @ApiPropertyOptional({ enum: BudgetCategory, example: BudgetCategory.FOOD })
  category?: BudgetCategory;

  @ApiPropertyOptional({
    example: '2026-02-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2026-02-28T23:59:59.999Z',
    type: 'string',
    format: 'date-time',
  })
  endDate?: Date;
}

// ---------- Responses ----------

export class BudgetResponseSwaggerDto implements BudgetResponseDto {
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

  @ApiProperty({ enum: BudgetCategory, example: BudgetCategory.FOOD })
  category: BudgetCategory;

  @ApiProperty({ example: '500.00' })
  allocatedAmount: string;

  @ApiProperty({ example: '350.50' })
  spentAmount: string;

  @ApiProperty({ example: '2026-02-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2026-02-28T23:59:59.999Z' })
  endDate: Date;

  @ApiProperty({ example: 'Monthly food budget', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2026-01-30T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-30T10:00:00.000Z' })
  updatedAt: Date;
}
