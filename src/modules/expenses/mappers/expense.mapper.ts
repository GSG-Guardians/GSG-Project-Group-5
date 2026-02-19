import { Expense } from '../../../../database/entities/expense.entities';

export function toMonthlyExpenseSummary(e: Expense) {
  return {
    category: e.category,
    amount: e.amount,
    date: e.dueDate,
  };
}
