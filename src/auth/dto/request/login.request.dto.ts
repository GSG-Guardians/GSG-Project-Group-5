import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LogInDto {
  @ApiProperty({
    description: 'The national ID of the user',
    example: '123456789',
    type: String,
  })
  @IsNotEmpty()
  @MaxLength(9)
  @MinLength(9)
  national_id: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password!1Q',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
