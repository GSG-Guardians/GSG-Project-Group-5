import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class FinancialReportRequestDto {
  @ApiProperty({
    example: '2026-01-01',
    description: 'Start date for the report period (ISO date format)',
    required: true,
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    example: '2026-01-31',
    description: 'End date for the report period (ISO date format)',
    required: true,
  })
  @IsDateString()
  end_date: string;
}
