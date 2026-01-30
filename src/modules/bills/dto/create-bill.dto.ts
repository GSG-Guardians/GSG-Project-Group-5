import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateBillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['individual', 'group']),
  userId: z.string().uuid().optional(),
  currencyId: z.string().uuid().optional(),
  description: z.string().nullable().optional(),
  assetId: z.string().uuid().nullable().optional(),
});

export class CreateBillDto extends createZodDto(CreateBillSchema) { }
