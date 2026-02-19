import { z } from 'zod';
import {
  RegisterPushTokenSchema,
  RemovePushTokenSchema,
} from '../schema/notification.schema';

export type RegisterPushTokenDto = z.infer<typeof RegisterPushTokenSchema>;
export type RemovePushTokenDto = z.infer<typeof RemovePushTokenSchema>;
