import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InstitutionLogInDto {
  @ApiProperty({
    description: 'The national ID of the user',
    example: 'WFB_123',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password!1Q',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
