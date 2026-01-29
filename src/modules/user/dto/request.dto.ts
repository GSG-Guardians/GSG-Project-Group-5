import { UserRole, UserStatus } from '../../../../database/enums';

export type CreateUserDto = {
    fullName: string;
    email: string;
    phone?: string | null;
    password?: string;
    provider?: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
    providerId?: string | null;
    defaultCurrencyId?: string | null;
    role?: UserRole;
    status?: UserStatus;
};

export type UpdateUserDto = Partial<Pick<CreateUserDto,
    | 'fullName'
    | 'email'
    | 'phone'
    | 'defaultCurrencyId'
    | 'provider'
    | 'providerId'
>> & {
    avatarAssetId?: string | null;
    role?: UserRole;
    status?: UserStatus;
};
