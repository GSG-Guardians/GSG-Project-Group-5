import { ApiProperty } from '@nestjs/swagger';
import { BudgetCategory } from 'src/enums/budget-category.enum';

export class CategoryBreakdownDto {
  @ApiProperty({
    example: BudgetCategory.FOOD,
    description: 'Category name',
    enum: BudgetCategory,
  })
  category: BudgetCategory;

  @ApiProperty({
    example: 350.5,
    description: 'Total amount spent in this category',
  })
  amount: number;

  @ApiProperty({
    example: 35.05,
    description: 'Percentage of total expenses',
  })
  percentage: number;
}

export class WeeklyExpenseDto {
  @ApiProperty({
    example: 1,
    description: 'Week number',
  })
  week: number;

  @ApiProperty({
    example: 450.25,
    description: 'Total expenses for the week',
  })
  amount: number;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Start date of the week',
  })
  start_date: Date;

  @ApiProperty({
    example: '2026-01-07',
    description: 'End date of the week',
  })
  end_date: Date;
}

export class FinancialInsightDto {
  @ApiProperty({
    example: 'alert',
    description: 'Type of insight (alert, recommendation, warning)',
  })
  insight_type: string;

  @ApiProperty({
    example: 'Budget Exceeded',
    description: 'Insight title',
  })
  title: string;

  @ApiProperty({
    example: 'Your food budget has been exceeded by 20%',
    description: 'Detailed insight message',
  })
  message: string;
}

export class FinancialReportResponseDto {
  @ApiProperty({
    example: 5000.0,
    description: 'Total income for the period',
  })
  total_income: number;

  @ApiProperty({
    example: 3500.0,
    description: 'Total expenses for the period',
  })
  total_expenses: number;

  @ApiProperty({
    example: 1500.0,
    description: 'Balance (income - expenses)',
  })
  balance: number;

  @ApiProperty({
    example: 1500.0,
    description: 'Savings amount',
  })
  savings: number;

  @ApiProperty({
    example: 30.0,
    description: 'Savings rate percentage',
  })
  savings_rate: number;

  @ApiProperty({
    type: [CategoryBreakdownDto],
    description: 'Expense breakdown by category',
  })
  category_breakdown: CategoryBreakdownDto[];

  @ApiProperty({
    type: [WeeklyExpenseDto],
    description: 'Weekly expense tracking',
  })
  weekly_expenses: WeeklyExpenseDto[];

  @ApiProperty({
    type: [FinancialInsightDto],
    description: 'Financial insights and recommendations',
  })
  insights: FinancialInsightDto[];

  @ApiProperty({
    example: '2026-01-01',
    description: 'Report period start date',
  })
  period_start: Date;

  @ApiProperty({
    example: '2026-01-31',
    description: 'Report period end date',
  })
  period_end: Date;
}
