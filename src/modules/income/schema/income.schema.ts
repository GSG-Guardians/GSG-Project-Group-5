import z, { ZodType } from 'zod';
<<<<<<< HEAD
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
=======
import { CreateIncomeDto, UpdateIncomeDto } from '../dto/request.dto';
import { IncomeSource, IncomeFrequency } from '../../../../database/enums';

const toYMD = (d: Date) => d.toISOString().slice(0, 10);

export const incomeBaseObjectSchema = z.object({
  amount: z.number().positive(),
  currencyId: z.string().uuid(),
  source: z.nativeEnum(IncomeSource),

  incomeDate: z.coerce.date().transform(toYMD),

  frequency: z
    .nativeEnum(IncomeFrequency)
    .optional()
    .default(IncomeFrequency.ONE_TIME),

  description: z.string().max(500).nullable().optional(),
  assetId: z.string().uuid().nullable().optional(),

  endAt: z.coerce
    .date()
    .nullable()
    .optional()
    .transform((v) => (v ? toYMD(v) : null)),

  isRecurringActive: z.boolean().optional(),
});

export const incomeValidationSchema = incomeBaseObjectSchema.superRefine(
  (val, ctx) => {
    if (val.frequency !== IncomeFrequency.ONE_TIME && val.endAt) {
      if (val.endAt <= val.incomeDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endAt'],
          message: 'endAt must be after incomeDate',
        });
      }
    }
  },
) satisfies ZodType<CreateIncomeDto>;

export const updateIncomeValidationSchema = incomeBaseObjectSchema
  .pick({
    amount: true,
    currencyId: true,
    source: true,
    incomeDate: true,
    frequency: true,
    description: true,
    assetId: true,
    endAt: true,
    isRecurringActive: true,
  })
  .partial()
  .superRefine((val, ctx) => {
    if (val.endAt && val.incomeDate && val.endAt <= val.incomeDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endAt'],
        message: 'endAt must be after incomeDate',
      });
    }
  }) satisfies ZodType<UpdateIncomeDto>;
>>>>>>> development
