import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsString,
  Min,
} from 'class-validator';
import { BudgetCategory } from 'database/enums';

export class CreateBudgetRequestDto {
  @ApiProperty({
    example: BudgetCategory.FOOD,
    description: 'Budget category',
    enum: BudgetCategory,
    required: true,
  })
  @IsEnum(BudgetCategory)
  @IsNotEmpty()
  category: BudgetCategory;

  @ApiProperty({
    example: 1000.0,
    description: 'Allocated amount for this budget',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  allocated_amount: number;

  @ApiProperty({
    example: 0,
    description: 'Amount already spent (default 0)',
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  spent_amount?: number;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Start date of budget period (ISO date format)',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({
    example: '2026-01-31',
    description: 'End date of budget period (ISO date format)',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({
    example: true,
    description: 'Whether this budget is currently active',
    default: true,
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
