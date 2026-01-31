// user/schema/user.schema.ts

import z, { ZodType } from 'zod';
import { CreateUserDto, UpdateUserDto } from '../dto/request.dto';

// base schema object
export const userBaseObjectSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().toLowerCase(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^\+?[0-9]+$/, 'Invalid phone number')
    .nullable()
    .optional(),

  password: z.string().min(6).max(100).optional(),
  provider: z.enum(['LOCAL', 'GOOGLE', 'FACEBOOK']).optional(),
  providerId: z.string().max(255).nullable().optional(),

  defaultCurrencyId: z.string().uuid().optional(),
  avatarAssetId: z.uuid().optional(),
});

export const userValidationSchema = userBaseObjectSchema.superRefine(
  (val, ctx) => {
    const provider = val.provider ?? 'LOCAL';
    if (provider === 'LOCAL' && !val.password) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password is required for LOCAL provider',
      });
    }
  },
) satisfies ZodType<CreateUserDto>;

export const updateUserValidationSchema = userBaseObjectSchema
  .pick({
    fullName: true,
    email: true,
    phone: true,
    defaultCurrencyId: true,
    avatarAssetId: true,
  })
  .partial() satisfies ZodType<UpdateUserDto>;
