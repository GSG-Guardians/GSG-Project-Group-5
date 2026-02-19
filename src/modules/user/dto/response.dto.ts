import { Asset } from 'database/entities/assets.entities';
import { User } from 'database/entities/user.entities';
export type UserResponseDto = {
  id: User['id'];
  fullName: User['fullName'];
  email: User['email'];
  phone: User['phone'];
  role: User['role'];
  status: User['status'];
  defaultCurrencyId: User['defaultCurrencyId'];
  currentBalance: User['currentBalance'];
  points: User['points'];
  avatarAssetId: User['avatarAssetId'];
  provider: User['provider'];
  providerId: User['providerId'];
  createdAt: User['createdAt'];
  updatedAt: User['updatedAt'];
  avatar: Asset[] | null;
};

export type ChangePasswordResponseDto = {
  message: string;
};
