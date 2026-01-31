import { DebtDirection, DebtStatus } from '../../../../database/enums';

export type DebtResponseDto = {
  id: string;
  userId: string;
  personalName: string;
  direction: DebtDirection;
  amount: string;
  currencyId: string;
  dueDate: string;
  description: string | null;
  status: DebtStatus;
  reminderEnabled: boolean;
  remindAt: Date | null;
  assetId: string | null;
  createdAt: Date;
  updatedAt: Date;
};
