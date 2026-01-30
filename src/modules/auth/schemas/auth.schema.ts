import { z } from 'zod';
import { userBaseObjectSchema } from '../../user/schema/user.schema';

export const SignUpSchema = userBaseObjectSchema
  .pick({
    email: true,
    fullName: true,
    phone: true,
  })
  .extend({
    password: z.string().min(6),
  });

export const SignInSchema = userBaseObjectSchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string().min(1),
  });
