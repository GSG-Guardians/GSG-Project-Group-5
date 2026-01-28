import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsString,
  Min,
} from 'class-validator';
import { BudgetCategory } from 'database/enums';

export class UpdateBudgetRequestDto {
  @ApiProperty({
    example: BudgetCategory.FOOD,
    description: 'Budget category',
    enum: BudgetCategory,
    required: false,
  })
  @IsEnum(BudgetCategory)
  @IsOptional()
  category?: BudgetCategory;

  @ApiProperty({
    example: 1000.0,
    description: 'Allocated amount for this budget',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0.01)
  allocated_amount?: number;

  @ApiProperty({
    example: 250.5,
    description: 'Amount already spent',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  spent_amount?: number;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Start date of budget period (ISO date format)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    example: '2026-01-31',
    description: 'End date of budget period (ISO date format)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    example: true,
    description: 'Whether this budget is currently active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: 'Monthly food budget for January',
    description: 'Additional notes for this budget',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
