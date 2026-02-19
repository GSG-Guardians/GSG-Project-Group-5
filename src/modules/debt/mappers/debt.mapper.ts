import { Debt } from '../../../../database/entities/debts.entities';
import { DebtResponseDto } from '../dto/response.dto';
import { TMonthlyDebtSummary } from '../debt.types';

export function toDebtResponse(d: Debt): DebtResponseDto {
  return {
    id: d.id,
    userId: d.userId,
    personalName: d.personalName,
    direction: d.direction,
    amount: d.amount,
    currencyId: d.currencyId,
    dueDate: d.dueDate,
    description: d.description ?? null,
    status: d.status,
    reminderEnabled: d.reminderEnabled,
    remindAt: d.remindAt ?? null,
    assetId: d.assetId ?? null,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export function toMonthlyDebtSummary(d: Debt): TMonthlyDebtSummary {
  return {
    personalName: d.personalName,
    amount: d.amount,
    dueDate: d.dueDate,
  };
}
