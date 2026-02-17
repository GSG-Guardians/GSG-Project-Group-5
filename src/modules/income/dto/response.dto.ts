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
