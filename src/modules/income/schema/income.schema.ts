import z, { ZodType } from 'zod';
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
