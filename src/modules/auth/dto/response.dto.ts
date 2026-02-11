import { UserResponseDto } from 'src/modules/user/dto/response.dto';

export type TAuthResponse = {
  user: UserResponseDto;
  token: string;
};

export type TPasswordResetGenericResponse = {
  success: boolean;
};

export type TPasswordResetVerifyResponse = {
  success: boolean;
  token: string;
};
