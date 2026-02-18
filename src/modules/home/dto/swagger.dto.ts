import { ApiProperty } from '@nestjs/swagger';
import type {
  HomeAttentionNeededItem,
  HomeOverviewResponseDto,
} from './response.dto';

class HomeUserSummarySwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Ghydaa' })
  fullName: string;

  @ApiProperty({
    nullable: true,
    example: 'https://ik.imagekit.io/app/avatar.webp',
  })
  avatarUrl: string | null;
}

class HomeCurrencySummarySwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'USD' })
  code: string;

  @ApiProperty({ nullable: true, example: '$' })
  symbol: string | null;

  @ApiProperty({ example: 'United States (US Dollar)' })
  name: string;
}

class HomeBalanceSummarySwaggerDto {
  @ApiProperty({ example: '1234.56' })
  current: string;
}

class HomeExpenseDueSwaggerDto {
  @ApiProperty({ example: '456.78' })
  amount: string;

  @ApiProperty({ example: 'current_month' })
  periodLabel: 'current_month';

  @ApiProperty({ example: '2026-02-01' })
  startDate: string;

  @ApiProperty({ example: '2026-02-28' })
  endDate: string;
}

class HomeAttentionNeededItemSwaggerDto implements HomeAttentionNeededItem {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'alert' })
  type: string;

  @ApiProperty({ example: 'Shopping Budget Near Limit' })
  title: string;

  @ApiProperty({
    example: 'You have spent 80% of your Shopping budget. Only $69.70 remaining.',
  })
  message: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: 80 })
  progressPercent: number;

  @ApiProperty({ example: '2026-02-10T08:00:00.000Z', type: String })
  createdAt: Date;
}

export class HomeOverviewResponseSwaggerDto implements HomeOverviewResponseDto {
  @ApiProperty({ type: HomeUserSummarySwaggerDto })
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };

  @ApiProperty({ type: HomeCurrencySummarySwaggerDto })
  currency: {
    id: string;
    code: string;
    symbol: string | null;
    name: string;
  };

  @ApiProperty({ type: HomeBalanceSummarySwaggerDto })
  balance: {
    current: string;
  };

  @ApiProperty({ type: HomeExpenseDueSwaggerDto })
  expenseDue: {
    amount: string;
    periodLabel: 'current_month';
    startDate: string;
    endDate: string;
  };

  @ApiProperty({ type: [HomeAttentionNeededItemSwaggerDto] })
  attentionNeeded: HomeAttentionNeededItem[];
}

