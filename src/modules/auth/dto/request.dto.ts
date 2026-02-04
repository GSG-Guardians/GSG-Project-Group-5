import { User } from 'database/entities/user.entities';
import { UserResponseDto } from 'src/modules/user/dto';

export type TSignInRequest = Pick<User, 'email'> & {
  password: string;
};

export type TSignUpRequest = Pick<User, 'email' | 'fullName' | 'phone'> & {
  password: string;
};

export type AuthResponseDTO = {
  token: string;
  user: UserResponseDto;
};
