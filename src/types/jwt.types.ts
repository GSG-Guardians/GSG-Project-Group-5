import { User } from 'database/entities/user.entities';
import { UserRole } from 'database/enums';

export interface IJWTPayload {
  sub: string;
  role: UserRole;
  email: string;
  fullName: string;
  provider: string;
  status: string;
}

export type TUserForToken = Pick<
  User,
  'id' | 'role' | 'email' | 'fullName' | 'provider' | 'status'
>;

export type TResetJwtPayload = {
  sub: string;
  type: 'pwd_reset';
  iat?: number;
  exp?: number;
};
