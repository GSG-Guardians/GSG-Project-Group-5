import { User } from 'database/entities/user.entities';

export type TSignInRequest = Pick<User, 'email'> & {
  password: string;
};

export type TSignUpRequest = Pick<User, 'email' | 'fullName' | 'phone'> & {
  password: string;
};
