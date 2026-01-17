import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchUserDto {
  @ApiProperty({
    example: 'isaac',
    description: 'Search term for guard first name or last name',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Search term cannot be empty' })
  @MinLength(1, { message: 'Search term must be at least 1 character' })
  @MaxLength(100, { message: 'Search term cannot exceed 100 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  searchTerm: string;
}
