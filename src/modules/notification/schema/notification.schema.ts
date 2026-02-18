import { z } from 'zod';

export const RegisterPushTokenSchema = z.object({
  token: z.string().min(20).max(512),
  platform: z.string().min(2).max(20),
});

export const RemovePushTokenSchema = z.object({
  token: z.string().min(20).max(512),
});
