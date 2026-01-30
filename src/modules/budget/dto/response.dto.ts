import { BudgetCategory } from '../../../../database/enums';

export type BudgetResponseDto = {
  id: string;
  userId: string;
  category: BudgetCategory;
  allocatedAmount: string;
  spentAmount: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
