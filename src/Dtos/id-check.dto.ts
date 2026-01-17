import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class IdCheckDto {
  @IsUUID('4', { message: ' id must be a valid UUID v4' })
  id: string;
}
export class UserIdCheckDto {
  @IsUUID('4', { message: ' id must be a valid UUID v4' })
  userID: string;
}

export class NationalIdCheckDto {
  @IsString()
  @IsNotEmpty()
  @IsNumberString({}, { message: 'national_id must contain only numbers' })
  @Matches(/^\d{9}$/, { message: 'national_id must be 9 digits' })
  @MaxLength(9, { message: 'national id must be 9 digits' })
  @MinLength(9, { message: 'national id must be 9 digits' })
  national_id: string;
}
