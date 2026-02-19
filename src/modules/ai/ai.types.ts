import { ChatRole } from 'database/enums';
import { TMonthlyBillSummary } from '../bills/bills.types';
import { TMonthlyBudgetSummary } from '../budget/budget.types';
import { TMonthlyDebtSummary } from '../debt/debt.types';
import { TMonthlyExpenseSummary } from '../expenses/expense.types';
import { TMonthlyIncomeSummary } from '../income/income.types';

export type TChatMessage = {
  source: ChatRole;
  content: string;
};

export type TGroqPromptInput = {
  username: string;
  monthlyBudgetSummary: TMonthlyBudgetSummary[];
  monthlyBillSummary: TMonthlyBillSummary[];
  monthlyDebtSummary: TMonthlyDebtSummary[];
  monthlyExpenseSummary: TMonthlyExpenseSummary[];
  monthlyIncomeSummary: TMonthlyIncomeSummary[];
  previousMessages?: TChatMessage[];
  userMessage: string;
};
