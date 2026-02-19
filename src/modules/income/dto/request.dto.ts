import { IncomeFrequency, IncomeSource } from '../../../../database/enums';

export type CreateIncomeRecurringDto = {
  frequency: IncomeFrequency;
  endAt?: string | null;
};

export type CreateIncomeDto = {
  amount: string;
  currencyId: string;
  source: IncomeSource;
  description?: string | null;
  incomeDate: string;
  assetId?: string | null;
  recurring?: CreateIncomeRecurringDto;
};

export type UpdateIncomeDto = Partial<
  Pick<
    CreateIncomeDto,
    | 'amount'
    | 'currencyId'
    | 'source'
    | 'description'
    | 'incomeDate'
    | 'assetId'
  >
>;

export type FilterIncomeDto = {
  source?: IncomeSource;
  currencyId?: string;
  startDate?: string;
  endDate?: string;
};
