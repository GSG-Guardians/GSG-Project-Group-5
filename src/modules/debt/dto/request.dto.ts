import { DebtDirection, DebtStatus } from '../../../../database/enums';

export type CreateDebtDto = {
  personalName: string;
  direction: DebtDirection;
  amount: string;
  dueDate: string;
  description?: string | null;
  reminderEnabled?: boolean;
  remindAt?: Date | null;
  assetId?: string | null;
};

export type UpdateDebtDto = Partial<
  Pick<
    CreateDebtDto,
    | 'personalName'
    | 'amount'
    | 'dueDate'
    | 'description'
    | 'reminderEnabled'
    | 'remindAt'
    | 'assetId'
  >
> & {
  status?: DebtStatus;
};

export type FilterDebtDto = {
  direction?: DebtDirection;
  status?: DebtStatus;
  currencyId?: string;
  startDate?: string;
  endDate?: string;
};
