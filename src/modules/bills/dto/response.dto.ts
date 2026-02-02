import { z } from 'zod';
import { SmartParseResponseSchema } from '../schemas/bills.schema';

export type TSmartParseResponse = z.infer<typeof SmartParseResponseSchema>;
