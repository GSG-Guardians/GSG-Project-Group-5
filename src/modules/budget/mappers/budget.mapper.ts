import { Budget } from '../../../../database/entities/budget.entities';
import { BudgetResponseDto } from '../dto/response.dto';

export function toBudgetResponse(b: Budget): BudgetResponseDto {
  return {
    id: b.id,
    userId: b.userId,
    category: b.category,
    allocatedAmount: b.allocated_amount,
    spentAmount: b.spent_amount,
    startDate: b.start_date,
    endDate: b.end_date,
    description: b.description ?? null,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  };
}
