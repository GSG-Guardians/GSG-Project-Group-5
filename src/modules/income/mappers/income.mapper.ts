import { Income } from '../../../../database/entities/income.entities';
import { IncomeResponseDto } from '../dto/response.dto';

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
