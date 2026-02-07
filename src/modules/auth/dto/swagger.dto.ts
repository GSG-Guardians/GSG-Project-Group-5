import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TSignInRequest, TSignUpRequest } from './request.dto';
import { UserResponseSwaggerDto } from '../../user/dto';

export class SignInRequestSwaggerDto implements TSignInRequest {
  @ApiProperty({ example: 'moamen@example.com' })
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Plain password (will be hashed on the server)',
    minLength: 8,
  })
  password: string;
}

export class SignUpRequestSwaggerDto implements TSignUpRequest {
  @ApiProperty({ example: 'moamen@example.com' })
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Plain password (will be hashed on the server)',
    minLength: 8,
  })
  password: string;

  @ApiProperty({ example: 'Moamen Al-Yazouri' })
  fullName: string;

  @ApiPropertyOptional({ example: '+213654321098' })
  phone: string;
}

export class AuthResponseSwaggerDto {
  @ApiProperty({ type: UserResponseSwaggerDto })
  user: UserResponseSwaggerDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}

export class PasswordResetRequestSwaggerDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;
}

export class PasswordResetVerifySwaggerDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '1234', description: '4-digit verification code' })
  code: string;
}

export class PasswordResetConfirmSwaggerDto {
  @ApiProperty({ example: 'NewStrongP@ssw0rd', minLength: 6 })
  newPassword: string;
}

export class PasswordResetGenericResponseSwaggerDto {
  @ApiProperty({ example: true })
  success: boolean;
}

export class PasswordResetVerifyResponseSwaggerDto {
  @ApiProperty({ example: true })
  success: boolean;
}
