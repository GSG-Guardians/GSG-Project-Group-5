import { User } from '../../../../database/entities/user.entities';
import { UserResponseDto } from '../dto/response.dto';

export function toUserResponse(u: User): UserResponseDto {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone ?? null,
    role: u.role,
    status: u.status,
    defaultCurrencyId: u.defaultCurrencyId ?? null,
    currentBalance: u.currentBalance,
    points: u.points,
    avatarAssetId: u.avatarAssetId ?? null,
    provider: u.provider,
    providerId: u.providerId ?? null,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    avatar: u.assets,
  };
}
