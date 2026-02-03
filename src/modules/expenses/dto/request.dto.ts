import { z } from 'zod';
import {
  CreateExpenseSchema,
  ExpensePeriodQuerySchema,
  ExpenseCategoryQuerySchema,
} from '../schema/expenses.schema';

export type TCreateExpenseRequest = z.infer<typeof CreateExpenseSchema>;
export type TExpensePeriodQuery = z.infer<typeof ExpensePeriodQuerySchema>;
export type TExpenseCategoryQuery = z.infer<typeof ExpenseCategoryQuerySchema>;
