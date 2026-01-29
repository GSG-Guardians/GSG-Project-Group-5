import { UserRole, UserStatus } from '../../../../database/enums';

export type UserResponseDto = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  defaultCurrencyId: string | null;
  currentBalance: string;
  points: string;
  avatarAssetId: string | null;
  provider: string;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};
