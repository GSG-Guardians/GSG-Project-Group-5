import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GetFinancialReportDto } from './request.dto';
import {
  FinancialReportResponseDto,
  CategoryBreakdown,
  WeeklyExpense,
  FinancialInsight,
} from './response.dto';
import { BudgetCategory } from 'database/enums';

// ---------- Requests ----------

export class GetFinancialReportRequestSwaggerDto implements GetFinancialReportDto {
  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  startDate: Date;

  @ApiProperty({
    example: '2026-01-31T23:59:59.999Z',
    type: 'string',
    format: 'date-time',
  })
  endDate: Date;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Currency ID for filtering',
  })
  currencyId?: string;
}

// ---------- Responses ----------

export class CategoryBreakdownSwaggerDto implements CategoryBreakdown {
  @ApiProperty({ enum: BudgetCategory, example: BudgetCategory.FOOD })
  category: BudgetCategory;

  @ApiProperty({ example: '350.50' })
  spent: string;

  @ApiProperty({ example: '500.00' })
  allocated: string;

  @ApiProperty({ example: 70.1 })
  percentage: number;
}

export class WeeklyExpenseSwaggerDto implements WeeklyExpense {
  @ApiProperty({ example: 'Week 1' })
  week: string;

  @ApiProperty({ example: '87.50' })
  amount: string;
}

export class FinancialInsightSwaggerDto implements FinancialInsight {
  @ApiProperty({ example: 'WARNING' })
  type: string;

  @ApiProperty({ example: 'Budget Alert' })
  title: string;

  @ApiProperty({ example: 'You have exceeded 80% of your Food budget' })
  message: string;

  @ApiProperty({ example: false })
  isRead: boolean;
}

export class FinancialReportPeriodSwaggerDto {
  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2026-01-31T23:59:59.999Z' })
  endDate: Date;
}

export class FinancialReportSummarySwaggerDto {
  @ApiProperty({ example: '5000.00' })
  totalIncome: string;

  @ApiProperty({ example: '3250.75' })
  totalExpenses: string;

  @ApiProperty({ example: '1749.25' })
  netSavings: string;

  @ApiProperty({ example: 65.01 })
  budgetUtilization: number;
}

export class FinancialReportResponseSwaggerDto implements FinancialReportResponseDto {
  @ApiProperty({ type: FinancialReportPeriodSwaggerDto })
  period: {
    startDate: Date;
    endDate: Date;
  };

  @ApiProperty({ type: FinancialReportSummarySwaggerDto })
  summary: {
    totalIncome: string;
    totalExpenses: string;
    netSavings: string;
    budgetUtilization: number;
  };

  @ApiProperty({ type: [CategoryBreakdownSwaggerDto] })
  categoryBreakdown: CategoryBreakdown[];

  @ApiProperty({ type: [WeeklyExpenseSwaggerDto] })
  weeklyTrend: WeeklyExpense[];

  @ApiProperty({ type: [FinancialInsightSwaggerDto] })
  insights: FinancialInsight[];
}

export class FinancialInsightResponseSwaggerDto extends FinancialInsightSwaggerDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
