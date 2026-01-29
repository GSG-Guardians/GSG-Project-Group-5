import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaPaginationSwaggerDto {
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 10 }) limit: number;
  @ApiProperty({ example: 5 }) totalPages: number;
  @ApiProperty({ example: 47 }) total: number;
}

export class SuccessOneSwaggerDto<T> {
  @ApiProperty({ example: true })
  success: true;

  // data type injected by helper (allOf)
  data: T;

  @ApiPropertyOptional({ example: 'Operation successful' })
  message?: string;
}

export class SuccessPaginatedSwaggerDto<T> {
  @ApiProperty({ example: true })
  success: true;

  // data type injected by helper (allOf)
  data: T[];

  @ApiProperty({ type: MetaPaginationSwaggerDto })
  meta: MetaPaginationSwaggerDto;

  @ApiPropertyOptional({ example: 'Operation successful' })
  message?: string;
}
