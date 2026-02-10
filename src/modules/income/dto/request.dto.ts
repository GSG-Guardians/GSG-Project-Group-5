import { IncomeSource, IncomeFrequency } from '../../../../database/enums';

export type CreateIncomeDto = {
  amount: number;
  currencyId: string;
  source: IncomeSource;

  incomeDate: string; // YYYY-MM-DD

  frequency?: IncomeFrequency;
  description?: string | null;
  assetId?: string | null;

  endAt?: string | null; // YYYY-MM-DD
  isRecurringActive?: boolean;
};
export type UpdateIncomeDto = Partial<
  Pick<
    CreateIncomeDto,
    | 'amount'
    | 'currencyId'
    | 'source'
    | 'incomeDate'
    | 'frequency'
    | 'description'
    | 'assetId'
    | 'endAt'
    | 'isRecurringActive'
  >
>;
