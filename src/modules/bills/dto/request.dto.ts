import { z } from 'zod';
import {
  CreateBillSchema,
  UpdateBillSchema,
  UpdateBillStatusSchema,
} from '../schemas/bills.schema';

export type TCreateBillRequest = z.infer<typeof CreateBillSchema>;
export type TUpdateBillRequest = z.infer<typeof UpdateBillSchema>;
export type TUpdateBillStatusRequest = z.infer<typeof UpdateBillStatusSchema>;
