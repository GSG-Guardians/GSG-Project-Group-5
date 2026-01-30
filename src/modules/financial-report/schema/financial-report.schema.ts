/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import z, { ZodType } from 'zod';
import { GetFinancialReportDto } from '../dto/request.dto';

const financialReportBaseSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  currencyId: z.string().uuid().optional(),
});

export const getFinancialReportValidationSchema =
  financialReportBaseSchema.refine((val) => val.endDate > val.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  }) satisfies ZodType<GetFinancialReportDto>;
