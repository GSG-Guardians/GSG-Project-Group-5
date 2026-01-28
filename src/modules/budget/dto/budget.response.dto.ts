import { ApiProperty } from '@nestjs/swagger';
import { BudgetCategory } from 'database/enums';

export class BudgetResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the budget',
  })
  id: string;

  @ApiProperty({
    example: BudgetCategory.FOOD,
    description: 'Budget category',
    enum: BudgetCategory,
  })
  category: BudgetCategory;

  @ApiProperty({
    example: 1000.0,
    description: 'Allocated amount for this budget',
  })
  allocated_amount: number;

  @ApiProperty({
    example: 250.5,
    description: 'Amount already spent',
  })
  spent_amount: number;

  @ApiProperty({
    example: 25.05,
    description: 'Percentage of budget spent (calculated)',
  })
  spent_percentage?: number;

  @ApiProperty({
    example: 749.5,
    description: 'Remaining budget amount (calculated)',
  })
  remaining_amount?: number;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Start date of budget period',
  })
  start_date: Date;

  @ApiProperty({
    example: '2026-01-31',
    description: 'End date of budget period',
  })
  end_date: Date;

  @ApiProperty({
    example: true,
    description: 'Whether this budget is currently active',
  })
  is_active: boolean;

  @ApiProperty({
    example: 'Monthly food budget for January',
    description: 'Additional notes for this budget',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID who owns this budget',
  })
  user_id: string;

  @ApiProperty({
    example: '2026-01-26T10:00:00Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-26T10:00:00Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
