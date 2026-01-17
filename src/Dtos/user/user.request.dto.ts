import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsUUID,
  IsStrongPassword,
  IsNumberString,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserRequestDto {
  @ApiProperty({
    example: '123456789',
    description: 'National ID (9 digits)',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsNumberString({}, { message: 'national_id must contain only numbers' })
  @Matches(/^\d{9}$/, { message: 'national_id must be 9 digits' })
  @MaxLength(9, { message: 'national id must be 9 digits' })
  @MinLength(9, { message: 'national id must be 9 digits' })
  national_id: string;

  @ApiProperty({
    example: '0597641331',
    description: 'Palestinian mobile number (e.g. 059xxxxxxx, 056xxxxxxx)',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:0)(59|56)\d{7}$/, {
    message:
      'phone_number must be a valid Palestinian number (e.g. 059xxxxxxx or 056xxxxxxx)',
  })
  @MaxLength(45)
  phone_number: string;

  @ApiProperty({
    example: 'password!1Q',
    description: 'The password of the User',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'isaac',
    description: 'First name of the inspector',
    required: true,
    type: String,
    maxLength: 45,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(45)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  first_name: string;

  @ApiProperty({
    example: 'kamel',
    description: 'Last name of the inspector',
    required: true,
    type: String,
    maxLength: 45,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(45)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  last_name: string;

  @ApiProperty({
    example: '+972597641332',
    description: 'WhatsApp number of the guard',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(?:\+970|\+972|00970|00972)(59|56)\d{7}$/, {
    message:
      'whatsApp_number must be a valid WhatsApp Palestinian number (e.g. +97059xxxxxxx, 0097256xxxxxxx )',
  })
  @MaxLength(45)
  whatsApp_number?: string;

  @ApiProperty({
    example: 'AB1234',
    description: 'Job number of the guard',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  job_number: string;

  @ApiProperty({
    example: 'PS1234567890',
    description: 'Bank IBAN of the guard (optional)',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  BANK_IBAN?: string;

  @ApiProperty({
    example: 'دير البلح - البركة ',
    description: 'Address of the guard (optional)',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Birthday of the guard (optional)',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'birthday must be a valid date string (YYYY-MM-DD)' },
  )
  birthday?: string;
}
