import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateBillSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  date: z.string().min(1).optional(),
  currencyId: z.string().uuid().optional(),
  description: z.string().nullable().optional(),
  assetId: z.string().uuid().nullable().optional(),
});

export class UpdateBillDto extends createZodDto(UpdateBillSchema) { }
