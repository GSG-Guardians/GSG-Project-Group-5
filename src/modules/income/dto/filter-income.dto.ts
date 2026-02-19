import { IncomeSource } from '../../../../database/enums';

export type FilterIncomeDto = {
  source?: IncomeSource;
  currencyId?: string;
  assetId?: string;
  incomeDate?: string; // YYYY-MM-DD
  description?: string;
};
