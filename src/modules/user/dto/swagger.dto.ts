import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './request.dto';
import { UserResponseDto } from './response.dto';
import { UserRole, UserStatus } from 'database/enums';
import { Asset } from 'database/entities/assets.entities';

// ---------- Requests ----------

export class CreateUserRequestSwaggerDto implements CreateUserDto {
  @ApiProperty({ example: 'moamen@example.com' })
  email: string;

  @ApiProperty({ example: 'Moamen Al-Yazouri', minLength: 2, maxLength: 120 })
  fullName: string;

  @ApiPropertyOptional({ example: '+970592497292', nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({ format: 'uuid' })
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

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER })
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.ACTIVE })
  status?: UserStatus;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  avatarAssetId?: string;
}

export class UpdateUserRequestSwaggerDto implements UpdateUserDto {

  @ApiPropertyOptional({ example: 'Moamen Al-Yazouri' })
  fullName?: string;

  @ApiPropertyOptional({ example: '+970592497292', nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({ type: 'string', format: 'binary', nullable: true })
  avatar?: Express.Multer.File;
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

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ format: 'uuid' })
  defaultCurrencyId: string;

  @ApiProperty({ example: '0.00' })
  currentBalance: string;

  @ApiProperty({ example: '0' })
  points: string;

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

  @ApiProperty()
  avatar: Asset[];
}
