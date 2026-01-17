import { OmitType, PartialType } from '@nestjs/swagger';

import { UserRequestDto } from './user.request.dto';

export class UpdateUserDto extends PartialType(
  OmitType(UserRequestDto, ['password'] as const),
) {}
