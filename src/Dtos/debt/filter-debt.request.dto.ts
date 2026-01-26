import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { DebtType } from 'src/enums/debt-type.enum';

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
