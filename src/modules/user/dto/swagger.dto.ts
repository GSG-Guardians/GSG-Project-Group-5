import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './request.dto';
import { UserResponseDto } from './response.dto';

// ---------- Requests ----------

export class CreateUserRequestSwaggerDto implements CreateUserDto {
  @ApiProperty({ example: 'moamen@example.com' })
  email: string;

  @ApiProperty({ example: 'Moamen Al-Yazouri', minLength: 2, maxLength: 120 })
  fullName: string;

  @ApiPropertyOptional({ example: '+970592497292', nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  defaultCurrencyId: string;

  @ApiPropertyOptional({ example: 'LOCAL' })
  provider?: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';

  @ApiPropertyOptional({ example: 'google-oauth-id-123', nullable: true })
  providerId?: string | null;

  @ApiPropertyOptional({
    example: 'StrongP@ssw0rd',
    description: 'Plain password (will be hashed on the server)',
    minLength: 6,
  })
  password?: string;
}

export class UpdateUserRequestSwaggerDto implements UpdateUserDto {
  @ApiPropertyOptional({ example: 'moamen@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'Moamen Al-Yazouri' })
  fullName?: string;

  @ApiPropertyOptional({ example: '+970592497292', nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  defaultCurrencyId?: string | null;

  @ApiPropertyOptional({ example: 'LOCAL' })
  provider?: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';

  @ApiPropertyOptional({ example: 'google-oauth-id-123', nullable: true })
  providerId?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  avatarAssetId?: string | null;
}

// ---------- Response ----------

export class UserResponseSwaggerDto implements UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'moamen@example.com' })
  email: string;

  @ApiProperty({ example: 'Moamen Al-Yazouri' })
  fullName: string;

  @ApiProperty({ example: '+970592497292', nullable: true })
  phone: string | null;

  @ApiProperty({ example: 'USER' })
  role: any;

  @ApiProperty({ example: 'ACTIVE' })
  status: any;

  @ApiProperty({ format: 'uuid', nullable: true })
  defaultCurrencyId: string | null;

  @ApiProperty({ example: '0.00' })
  currentBalance: any;

  @ApiProperty({ example: '0' })
  points: any;

  @ApiProperty({ format: 'uuid', nullable: true })
  avatarAssetId: string | null;

  @ApiProperty({ example: 'LOCAL' })
  provider: string;

  @ApiProperty({ nullable: true })
  providerId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
