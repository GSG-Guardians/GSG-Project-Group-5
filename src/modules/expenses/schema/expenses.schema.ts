import z from 'zod';
import { CategoryName } from '../../../../database/enums';

const periodEnum = z.enum(['day', 'week', 'month', 'year']);

const expensePeriodBaseSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  period: periodEnum.optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  currencyId: z.string().uuid().optional(),
});

export const ExpensePeriodQuerySchema = expensePeriodBaseSchema.refine(
  (val) => !(val.from && !val.to) && !(val.to && !val.from),
  {
    message: 'from and to must be provided together',
    path: ['from'],
  },
);

export const ExpenseCategoryQuerySchema = expensePeriodBaseSchema
  .extend({
    type: z.literal('expense').optional(),
  })
  .refine((val) => !(val.from && !val.to) && !(val.to && !val.from), {
    message: 'from and to must be provided together',
    path: ['from'],
  });

export const CreateExpenseSchema = z.object({
  name: z.string().min(1).max(160),
  amount: z.number().positive('Amount must be positive'),
  currencyId: z.string().uuid(),
  category: z.nativeEnum(CategoryName).optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  description: z.string().max(1000).nullable().optional(),
  assetId: z.string().uuid().nullable().optional(),
});
