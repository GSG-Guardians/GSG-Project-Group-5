import { CategoryName } from '../../../../database/enums';
import { Expense } from '../../../../database/entities/expense.entities';

export type ExpenseOverviewResponse = {
  totalBalance: string;
  totalIncome: string;
  totalExpenses: string;
};

export type ExpenseCategoryBreakdown = {
  category: CategoryName;
  totalAmount: string;
  percentage: number;
};

export type ExpenseDonutSegment = {
  category: CategoryName;
  totalAmount: string;
  percentage: number;
};

export type ExpenseCategoryOption = {
  category: CategoryName;
  percentage: number;
};

export type ExpenseResponse = {
  id: Expense['id'];
  userId: Expense['userId'];
  name: Expense['name'];
  amount: Expense['amount'];
  currencyId: Expense['currencyId'];
  category: Expense['category'];
  dueDate: Expense['dueDate'];
  description: Expense['description'];
  assetId: Expense['assetId'];
  createdAt: Expense['createdAt'];
  updatedAt: Expense['updatedAt'];
};
