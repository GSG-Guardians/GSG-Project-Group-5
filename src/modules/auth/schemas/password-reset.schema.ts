import { z } from 'zod';

export const PasswordResetRequestSchema = z.object({
  email: z.email(),
});

export const PasswordResetVerifySchema = z.object({
  email: z.email(),
  code: z.string().min(4),
});

export const PasswordResetConfirmSchema = z.object({
  resetToken: z.string().min(1),
  newPassword: z.string().min(6),
});
