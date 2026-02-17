import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../../decorators/roles.decorators';
import { UserRole } from '../../../database/enums/index';

@Roles([UserRole.ADMIN])
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/dashboard/stats')
  getStats() {
    return this.adminService.getDashboardStatistics();
  }

  @Get('/dashboard/peak-hours')
  getPeakHours() {
    return this.adminService.getPeakHourly();
  }

  @Get('/dashboard/bills-vs-expenses')
  getBillsVsExpenses() {
    return this.adminService.getBillsVsExpensesMonthly();
  }

  @Get('/dashboard/financial-snapshot')
  getFinancialSnapShot() {
    return this.adminService.getFinancialSnapShot();
  }

  @Get('/user-managements/stats')
  getUserManagementStats() {
    return this.adminService.getUserManagementStatistics();
  }
}
