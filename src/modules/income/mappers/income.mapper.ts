import { Income } from '../../../../database/entities/income.entities';
import { IncomeResponseDto } from '../dto/response.dto';
import { TMonthlyIncomeSummary } from '../income.types';

export function toIncomeResponse(income: Income): IncomeResponseDto {
  return {
    id: income.id,
    userId: income.userId,
    amount: income.amount,
    currencyId: income.currencyId,
    source: income.source,
    description: income.description ?? null,
    incomeDate: income.incomeDate,
    assetId: income.assetId ?? null,
    createdAt: income.createdAt,
    updatedAt: income.updatedAt,
  };
}

export function toMonthlyIncomeSummary(i: Income): TMonthlyIncomeSummary {
  return {
    source: i.source,
    amount: i.amount,
    incomeDate: i.incomeDate,
  };
}
