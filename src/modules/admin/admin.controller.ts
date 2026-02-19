import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  ApiSuccess,
  ApiSuccessArray,
} from '../../helpers/swaggerDTOWrapper.helpers';
import {
  DashboardDonutSwaggerDto,
  DashboardStatisticsSwaggerDto,
  HourCountSwaggerDto,
  MonthlyPointSwaggerDto,
  UserManagementStatisticsSwaggerDto,
} from './dto/swagger.dto';
import { Roles } from '../../decorators/roles.decorators';
import { UserRole } from '../../../database/enums/index';

@ApiTags('Admin')
@Roles([UserRole.ADMIN])
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/dashboard/stats')
  @ApiSuccess(DashboardStatisticsSwaggerDto)
  getStats() {
    return this.adminService.getDashboardStatistics();
  }

  @Get('/dashboard/peak-hours')
  @ApiSuccessArray(HourCountSwaggerDto)
  getPeakHours() {
    return this.adminService.getPeakHourly();
  }

  @Get('/dashboard/bills-vs-expenses')
  @ApiSuccessArray(MonthlyPointSwaggerDto)
  getBillsVsExpenses() {
    return this.adminService.getBillsVsExpensesMonthly();
  }

  @Get('/dashboard/financial-snapshot')
  @ApiSuccess(DashboardDonutSwaggerDto)
  getFinancialSnapShot() {
    return this.adminService.getFinancialSnapShot();
  }

  @Get('/user-managements/stats')
  @ApiSuccess(UserManagementStatisticsSwaggerDto)
  getUserManagementStats() {
    return this.adminService.getUserManagementStatistics();
  }
}
