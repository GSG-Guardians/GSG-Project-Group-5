import { z } from 'zod';
import {
  CreateExpenseSchema,
  ExpenseTotalsQuerySchema,
  ExpenseDonutQuerySchema,
  ExpenseCategoryQuerySchema,
} from '../schema/expenses.schema';

export type TCreateExpenseRequest = z.infer<typeof CreateExpenseSchema>;
export type TExpenseTotalsQuery = z.infer<typeof ExpenseTotalsQuerySchema>;
export type TExpenseDonutQuery = z.infer<typeof ExpenseDonutQuerySchema>;
export type TExpenseCategoryQuery = z.infer<typeof ExpenseCategoryQuerySchema>;
