import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryName } from '../../../../database/enums';
import type {
  ExpenseCategoryBreakdown,
  ExpenseCategoryOption,
  ExpenseDonutSegment,
  ExpenseOverviewResponse,
  ExpenseResponse,
} from './response.dto';
import type { TCreateExpenseRequest } from './request.dto';

export class ExpenseOverviewResponseSwaggerDto
  implements ExpenseOverviewResponse
{
  @ApiProperty({ example: '1200.50' })
  totalBalance: string;

  @ApiProperty({ example: '3500.00' })
  totalIncome: string;

  @ApiProperty({ example: '2299.50' })
  totalExpenses: string;
}

export class ExpenseCategoryBreakdownSwaggerDto
  implements ExpenseCategoryBreakdown
{
  @ApiProperty({ enum: CategoryName, example: CategoryName.FOOD })
  category: CategoryName;

  @ApiProperty({ example: '250.25' })
  totalAmount: string;

  @ApiProperty({ example: 35.5 })
  percentage: number;
}

export class ExpenseDonutSegmentSwaggerDto implements ExpenseDonutSegment {
  @ApiProperty({ enum: CategoryName, example: CategoryName.FOOD })
  category: CategoryName;

  @ApiProperty({ example: '250.25' })
  totalAmount: string;

  @ApiProperty({ example: 35.5 })
  percentage: number;
}

export class ExpenseCategoryOptionSwaggerDto implements ExpenseCategoryOption {
  @ApiProperty({ enum: CategoryName, example: CategoryName.FOOD })
  category: CategoryName;

  @ApiProperty({ example: 35.5 })
  percentage: number;
}

export class CreateExpenseRequestSwaggerDto implements TCreateExpenseRequest {
  @ApiProperty({ example: 'Groceries' })
  name: string;

  @ApiProperty({ example: 120.5 })
  amount: number;

  @ApiProperty({ format: 'uuid' })
  currencyId: string;

  @ApiPropertyOptional({ enum: CategoryName, example: CategoryName.FOOD })
  category?: CategoryName;

  @ApiProperty({ example: '2026-02-01' })
  dueDate: string;

  @ApiPropertyOptional({ example: 'Weekly grocery run', nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  assetId?: string | null;
}

export class ExpenseResponseSwaggerDto implements ExpenseResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ example: 'Groceries' })
  name: string;

  @ApiProperty({ example: '120.50' })
  amount: string;

  @ApiProperty({ format: 'uuid' })
  currencyId: string;

  @ApiProperty({ enum: CategoryName, example: CategoryName.FOOD })
  category: CategoryName;

  @ApiProperty({ example: '2026-02-01' })
  dueDate: string;

  @ApiPropertyOptional({ example: 'Weekly grocery run', nullable: true })
  description: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  assetId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
