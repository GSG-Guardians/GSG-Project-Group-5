import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword, IsUUID } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'id of the change password request',
    example: '324234234-235325325-234234234',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsUUID('4')
  change_password_request_id: string;

  @ApiProperty({
    example: 'password!1Q',
    description: 'The password of the User',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

export class InstitutionChangePasswordDto extends PickType(ChangePasswordDto, [
  'password',
] as const) {}
