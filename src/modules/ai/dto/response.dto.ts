import { CategoryName } from '../../../../database/enums';
export type ChatResponseDto = {
  response: string;
  chatId: string;
};
export type BudgetSuggestionItem = {
  category: CategoryName;
  amount: number;
  percentage: number;
};

export type BudgetSuggestionTuple = [
  {
    category: CategoryName.HOUSING;
    amount: number;
    percentage: number;
  },
  {
    category: CategoryName.TRANSPORT;
    amount: number;
    percentage: number;
  },
  {
    category: CategoryName.HEALTH;
    amount: number;
    percentage: number;
  },
];

export type BudgetSuggestionResponseDto = {
  data: BudgetSuggestionTuple;
};
