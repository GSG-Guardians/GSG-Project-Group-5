import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TCreateBillRequest,
  TUpdateBillRequest,
  TUpdateBillStatusRequest,
} from './request.dto';
import { TSmartParseResponse } from './response.dto';

export class CreateBillSwaggerDto implements TCreateBillRequest {
  @ApiProperty({ example: 'Groceries' })
  name: string;

  @ApiProperty({ example: 50.25, description: 'Amount must be positive' })
  amount: number;

  @ApiProperty({ example: '2023-11-20' })
  date: string;

  @ApiProperty({
    enum: ['individual', 'group'],
    example: 'individual',
  })
  type: 'individual' | 'group';

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID if assigned explicitly',
  })
  userId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  currencyId?: string;

  @ApiPropertyOptional({
    example: 'Weekly grocery shopping',
    nullable: true,
  })
  description?: string | null;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  assetId?: string | null;
}

export class UpdateBillSwaggerDto implements TUpdateBillRequest {
  @ApiPropertyOptional({ example: 'Groceries' })
  name?: string;

  @ApiPropertyOptional({
    example: 50.25,
    description: 'Amount must be positive',
  })
  amount?: number;

  @ApiPropertyOptional({ example: '2023-11-20' })
  date?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  currencyId?: string;

  @ApiPropertyOptional({
    example: 'Weekly grocery shopping',
    nullable: true,
  })
  description?: string | null;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  assetId?: string | null;
}

export class UpdateBillStatusSwaggerDto implements TUpdateBillStatusRequest {
  @ApiProperty({ enum: ['paid', 'unpaid'], example: 'paid' })
  status: 'paid' | 'unpaid';
}

export class SmartParseResponseSwaggerDto implements TSmartParseResponse {
  @ApiProperty({ example: 'Lunch', nullable: true })
  name: string | null;

  @ApiProperty({ example: 25.5, nullable: true })
  amount: number | null;

  @ApiProperty({ example: '2023-10-15', nullable: true })
  date: string | null;

  @ApiProperty({
    enum: ['individual', 'group'],
    example: 'individual',
    nullable: true,
  })
  type: 'individual' | 'group' | null;
}

export class BillListItemSwaggerDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  name: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: ['paid', 'unpaid'] })
  status: 'paid' | 'unpaid';

  @ApiProperty({ enum: ['individual', 'group'] })
  type: 'individual' | 'group';

  @ApiProperty()
  currencyId: string;
}

export class BillListMetaSwaggerDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;
}

export class BillListResponseSwaggerDto {
  @ApiProperty({ type: [BillListItemSwaggerDto] })
  items: BillListItemSwaggerDto[];

  @ApiProperty({ type: BillListMetaSwaggerDto })
  meta: BillListMetaSwaggerDto;
}

export class BillResponseSwaggerDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['individual', 'group'] })
  type: 'individual' | 'group';

  @ApiProperty({ enum: ['paid', 'unpaid'] })
  status: 'paid' | 'unpaid';

  @ApiProperty({ description: 'Due date of the bill' })
  dueDate: Date;

  @ApiProperty()
  currencyId: string;

  @ApiPropertyOptional({ description: 'Name (for individual bills)' })
  name?: string;

  @ApiPropertyOptional({ description: 'Amount (for individual bills)' })
  amount?: string;

  @ApiPropertyOptional({ description: 'Title (for group bills)' })
  title?: string;

  @ApiPropertyOptional({ description: 'Total Amount (for group bills)' })
  amountTotal?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  assetId?: string;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;
}
