import { z } from 'zod';

export const CreateBillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['individual', 'group']),
  currencyId: z.string().uuid().optional(),
  description: z.string().nullable().optional(),
});

export const UpdateBillSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.coerce.number().positive().optional(),
  date: z.string().min(1).optional(),
  currencyId: z.string().uuid().optional(),
  description: z.string().nullable().optional(),
});

export const UpdateBillStatusSchema = z.object({
  status: z.enum(['paid', 'unpaid']),
});

export const SmartParseResponseSchema = z.object({
  name: z.string().nullable(),
  amount: z.number().nullable(),
  date: z.string().nullable(),
  type: z.enum(['individual', 'group']).nullable(),
});
