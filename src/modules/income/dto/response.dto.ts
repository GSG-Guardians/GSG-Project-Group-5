<<<<<<< HEAD
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
=======
import { IncomeSource, IncomeFrequency } from '../../../../database/enums';

export type IncomeResponseDto = {
  id: string;
  amount: number;
  currencyId: string;
  source: IncomeSource;
  incomeDate: string; // YYYY-MM-DD
  frequency: IncomeFrequency;
  description: string | null;
  assetId: string | null;
  createdAt: Date;
};

export type IncomeSummaryDto = {
  totalIncome: number;
  percentChangeVsPreviousPeriod: number;
  topSource: IncomeSource | null;
  topSourceAmount: number;
};

export type IncomeBreakdownItemDto = {
  source: IncomeSource;
  amount: number;
  percentage: number;
};

export type IncomeBreakdownDto = {
  totalIncome: number;
  items: IncomeBreakdownItemDto[];
>>>>>>> development
};
