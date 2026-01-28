import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { BudgetCategory } from 'database/enums';

export class FilterBudgetRequestDto {
  @ApiProperty({
    example: BudgetCategory.FOOD,
    description: 'Filter by budget category',
    enum: BudgetCategory,
    required: false,
  })
  @IsEnum(BudgetCategory)
  @IsOptional()
  category?: BudgetCategory;

  @ApiProperty({
    example: true,
    description: 'Filter by active status',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
