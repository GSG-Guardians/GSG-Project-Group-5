import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RolesEnum } from 'src/enums/roles.enum';

export class UserRoleFilterDto {
  @ApiProperty({
    type: String,
    enum: RolesEnum,
    example: RolesEnum.ADMIN,
    description: 'user role',
    required: false,
  })
  @IsOptional()
  @IsEnum(RolesEnum)
  role?: RolesEnum;
}
