import { User } from 'database/entities/user.entities';
import { UserRole } from 'database/enums';

export interface IJWTPayload {
  sub: string;
  role: UserRole;
  email: string;
  fullName: string;
  defaultCurrencyId: string;
  provider: string;
  status: string;
}

export type TUserForToken = Pick<
  User,
  | 'id'
  | 'role'
  | 'email'
  | 'fullName'
  | 'defaultCurrencyId'
  | 'provider'
  | 'status'
>;

export type TUserForResponse = Omit<User, 'passwordHash'>;
