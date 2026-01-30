import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateBillStatusSchema = z.object({
    status: z.enum(['paid', 'unpaid']),
});

export class UpdateBillStatusDto extends createZodDto(UpdateBillStatusSchema) { }
