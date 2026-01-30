import { BudgetCategory } from '../../../../database/enums';

export type CategoryBreakdown = {
  category: BudgetCategory;
  spent: string;
  allocated: string;
  percentage: number;
};

export type WeeklyExpense = {
  week: string;
  amount: string;
};

export type FinancialInsight = {
  type: string;
  title: string;
  message: string;
  isRead: boolean;
};

export type FinancialReportResponseDto = {
  period: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalIncome: string;
    totalExpenses: string;
    netSavings: string;
    budgetUtilization: number;
  };
  categoryBreakdown: CategoryBreakdown[];
  weeklyTrend: WeeklyExpense[];
  insights: FinancialInsight[];
};
