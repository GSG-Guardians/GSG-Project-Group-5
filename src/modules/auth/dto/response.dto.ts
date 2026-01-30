import { UserResponseDto } from 'src/modules/user/dto/response.dto';

export type TAuthResponse = {
  user: UserResponseDto;
  token: string;
};
