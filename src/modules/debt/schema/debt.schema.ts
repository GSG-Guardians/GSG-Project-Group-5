import z, { ZodType } from 'zod';
import { CreateDebtDto, UpdateDebtDto } from '../dto/request.dto';
import { DebtDirection, DebtStatus } from '../../../../database/enums';

const debtBaseObjectSchema = z.object({
  personalName: z.string().min(1).max(160),
  direction: z.nativeEnum(DebtDirection),
  amount: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      'Amount must be a valid decimal with up to 2 decimal places',
    ),
  currencyId: z.string().uuid('Invalid currency ID'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  description: z.string().max(1000).nullable().optional(),
  reminderEnabled: z.boolean().optional(),
  remindAt: z.coerce.date().nullable().optional(),
  assetId: z.string().uuid().nullable().optional(),
});

export const debtValidationSchema = debtBaseObjectSchema.refine(
  (val) => {
    if (val.reminderEnabled && !val.remindAt) {
      return false;
    }
    return true;
  },
  {
    message: 'Reminder date is required when reminder is enabled',
    path: ['remindAt'],
  },
) satisfies ZodType<CreateDebtDto>;

export const updateDebtValidationSchema = debtBaseObjectSchema
  .pick({
    personalName: true,
    amount: true,
    dueDate: true,
    description: true,
    reminderEnabled: true,
    remindAt: true,
    assetId: true,
  })
  .extend({
    status: z.nativeEnum(DebtStatus).optional(),
  })
  .partial()
  .refine(
    (val) => {
      if (val.reminderEnabled && !val.remindAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Reminder date is required when reminder is enabled',
      path: ['remindAt'],
    },
  ) satisfies ZodType<UpdateDebtDto>;
