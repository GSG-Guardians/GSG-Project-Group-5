import { ApiProperty } from '@nestjs/swagger';
import {
  TDashboardDount,
  TDashboardStatistics,
  TMonthlyPoint,
  TUserManagementStatistics,
} from './response.dto';
import { THourCount } from '../admin.types';

class CountWithChangeDto {
  @ApiProperty({ example: 100 })
  count: number;

  @ApiProperty({ example: 15.5 })
  changePercent: number;
}

class CountWithPercentageDto {
  @ApiProperty({ example: 3000 })
  count: number;

  @ApiProperty({ example: 60 })
  percentage: number;
}

export class DashboardStatisticsSwaggerDto implements TDashboardStatistics {
  @ApiProperty({ type: CountWithChangeDto })
  activeUsers: CountWithChangeDto;

  @ApiProperty({ type: CountWithChangeDto })
  totalUsers: CountWithChangeDto;

  @ApiProperty({ type: CountWithChangeDto })
  debts: CountWithChangeDto;
}

export class DashboardDonutSwaggerDto implements TDashboardDount {
  @ApiProperty({ type: CountWithPercentageDto })
  expenses: CountWithPercentageDto;

  @ApiProperty({ type: CountWithPercentageDto })
  revenues: CountWithPercentageDto;

  @ApiProperty({ type: CountWithPercentageDto })
  debts: CountWithPercentageDto;
}

export class MonthlyPointSwaggerDto implements TMonthlyPoint {
  @ApiProperty({ example: 'Jan' })
  month: string;

  @ApiProperty({ example: 1200 })
  bills: number;

  @ApiProperty({ example: 800 })
  expenses: number;
}

export class UserManagementStatisticsSwaggerDto implements TUserManagementStatistics {
  @ApiProperty({ type: CountWithChangeDto })
  activeUsers: CountWithChangeDto;

  @ApiProperty({ type: CountWithChangeDto })
  totalUsers: CountWithChangeDto;

  @ApiProperty({ type: CountWithChangeDto })
  uActiveUsers: CountWithChangeDto;

  @ApiProperty({ type: CountWithChangeDto })
  newUsers: CountWithChangeDto;
}

export class HourCountSwaggerDto implements THourCount {
  @ApiProperty({ example: '14:00' })
  hour: string;

  @ApiProperty({ example: 45 })
  count: number;
}
