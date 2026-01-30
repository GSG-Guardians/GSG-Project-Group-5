/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import z, { ZodType } from 'zod';
import { CreateBudgetDto, UpdateBudgetDto } from '../dto/request.dto';
import { BudgetCategory } from '../../../../database/enums';

const budgetBaseObjectSchema = z.object({
  category: z.nativeEnum(BudgetCategory),
  allocatedAmount: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      'Amount must be a valid decimal with up to 2 decimal places',
    ),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().max(500).nullable().optional(),
});

export const budgetValidationSchema = budgetBaseObjectSchema.refine(
  (val) => val.endDate > val.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  },
) satisfies ZodType<CreateBudgetDto>;

export const updateBudgetValidationSchema = budgetBaseObjectSchema
  .pick({
    allocatedAmount: true,
    startDate: true,
    endDate: true,
    description: true,
  })
  .partial()
  .refine(
    (val) => {
      if (val.startDate && val.endDate) {
        return val.endDate > val.startDate;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    },
  ) satisfies ZodType<UpdateBudgetDto>;
