import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus, DebtType } from 'database/enums';

export class FilterDebtRequestDto {
  @ApiProperty({
    example: PaymentStatus.UNPAID,
    description: 'Filter by payment status',
    enum: PaymentStatus,
    required: false,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;

  @ApiProperty({
    example: DebtType.INDIVIDUAL,
    description: 'Filter by debt type',
    enum: DebtType,
    required: false,
  })
  @IsEnum(DebtType)
  @IsOptional()
  debt_type?: DebtType;
}
