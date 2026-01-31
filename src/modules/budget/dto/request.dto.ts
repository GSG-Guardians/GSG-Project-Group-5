import { BudgetCategory } from '../../../../database/enums';

export type CreateBudgetDto = {
  category: BudgetCategory;
  allocatedAmount: string;
  startDate: Date;
  endDate: Date;
  description?: string | null;
};

export type UpdateBudgetDto = Partial<
  Pick<
    CreateBudgetDto,
    'allocatedAmount' | 'startDate' | 'endDate' | 'description'
  >
>;

export type FilterBudgetDto = {
  category?: BudgetCategory;
  startDate?: Date;
  endDate?: Date;
};
