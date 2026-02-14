import z, { ZodType } from 'zod';
import { IncomeFrequency, IncomeSource } from '../../../../database/enums';
import { CreateIncomeDto, UpdateIncomeDto } from '../dto/request.dto';

const recurringSchema = z.object({
  frequency: z.nativeEnum(IncomeFrequency),
  endAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .nullable()
    .optional(),
});

const incomeBaseObjectSchema = z.object({
  amount: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      'Amount must be a valid decimal with up to 2 decimal places',
    ),
  currencyId: z.string().uuid('Invalid currency ID'),
  source: z.nativeEnum(IncomeSource),
  description: z.string().max(1000).nullable().optional(),
  incomeDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Income date must be in YYYY-MM-DD format'),
  assetId: z.string().uuid().nullable().optional(),
  recurring: recurringSchema.optional(),
});

export const incomeValidationSchema =
  incomeBaseObjectSchema satisfies ZodType<CreateIncomeDto>;

export const updateIncomeValidationSchema = incomeBaseObjectSchema
  .omit({ recurring: true })
  .partial() satisfies ZodType<UpdateIncomeDto>;
