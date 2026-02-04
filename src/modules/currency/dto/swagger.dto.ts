import { ApiProperty } from '@nestjs/swagger';

export class CurrencyResponseSwaggerDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: 'USD' })
    code: string;

    @ApiProperty({ example: '$', nullable: true })
    symbol: string | null;

    @ApiProperty({ example: 'US Dollar' })
    name: string;
}
