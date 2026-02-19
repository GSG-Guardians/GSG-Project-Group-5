import { IncomeSource } from '../../../../database/enums';

export type IncomeResponseDto = {
  id: string;
  userId: string;
  amount: string;
  currencyId: string;
  source: IncomeSource;
  description: string | null;
  incomeDate: string;
  assetId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IncomePeriod = 'week' | 'month' | 'year';

export type IncomeSummaryDto = {
  totalIncome: number;
  percentChangeVsPreviousPeriod: number;
  topSource: IncomeSource | null;
  topSourceAmount: number;
};

export type IncomeBreakdownDto = {
  totalIncome: number;
  items: {
    source: IncomeSource;
    amount: number;
    percentage: number;
  }[];
};
