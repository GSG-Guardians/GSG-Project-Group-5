import { Budget } from '../../../../database/entities/budget.entities';
import { TMonthlyBudgetSummary } from '../budget.types';
import { BudgetResponseDto } from '../dto/response.dto';

export function toBudgetResponse(b: Budget): BudgetResponseDto {
  return {
    id: b.id,
    userId: b.user_id,
    category: b.category,
    allocatedAmount: b.allocated_amount.toString(),
    spentAmount: b.spent_amount.toString(),
    startDate: b.start_date,
    endDate: b.end_date,
    description: b.notes ?? null,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

export function toMonthlyBudgetSummary(b: Budget): TMonthlyBudgetSummary {
  return {
    category: b.category,
    allocatedAmount: b.allocated_amount.toString(),
    spentAmount: b.spent_amount.toString(),
    startDate: b.start_date,
    endDate: b.end_date,
  };
}
