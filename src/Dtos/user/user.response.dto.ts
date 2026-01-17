import { ApiProperty } from '@nestjs/swagger';
import { UserE } from 'src/entities/user.entity';
import { RolesEnum } from 'src/enums/roles.enum';

export class UserResponseDto {
  @ApiProperty({
    example: 'e7a3b2a1-9f02-4b9b-8c56-68b7eaa1b66b',
    description: 'Unique identifier for the inspector',
    type: String,
  })
  id: string;

  @ApiProperty({
    example: '123456789',
    description: 'National ID (unique)',
    type: String,
  })
  national_id: string;

  @ApiProperty({
    example: '+972597641331',
    description: 'Phone number of the inspector',
    type: String,
  })
  phone_number: string;

  @ApiProperty({
    example: 'Isaac',
    description: 'First name of the inspector',
    type: String,
  })
  first_name: string;

  @ApiProperty({
    example: 'Qadih',
    description: 'Last name of the inspector',
    type: String,
  })
  last_name: string;

  @ApiProperty({
    example: '+972597641332',
    description: 'WhatsApp number of the guard',
    required: false,
    type: String,
  })
  whatsApp_number?: string;

  @ApiProperty({
    example: 'AB1234',
    description: 'Job number of the guard',
    required: true,
    type: String,
  })
  job_number: string;

  @ApiProperty({
    example: 'PS1234567890',
    description: 'Bank IBAN of the guard (optional)',
    required: false,
    type: String,
  })
  BANK_IBAN?: string;

  @ApiProperty({
    example: 'دير البلح - البركة ',
    description: 'Address of the guard (optional)',
    required: false,
    type: String,
  })
  address?: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Birthday of the guard (optional)',
    required: false,
    type: String,
  })
  birthday?: Date;

  @ApiProperty({
    example: [RolesEnum.ADMIN],
    description: 'Roles assigned to the inspector',
    enum: RolesEnum,
    isArray: true,
  })
  roles: RolesEnum[];

  static createFromEntity(entity: UserE): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.national_id = entity.national_id;
    dto.phone_number = entity.phone_number;
    dto.first_name = entity.first_name;
    dto.last_name = entity.last_name;
    dto.whatsApp_number = entity.whatsApp_number;
    dto.job_number = entity.job_number;
    dto.BANK_IBAN = entity.BANK_IBAN;
    dto.address = entity.address;
    dto.birthday = entity.birthday;
    dto.roles = entity.roles;
    return dto;
  }
}
