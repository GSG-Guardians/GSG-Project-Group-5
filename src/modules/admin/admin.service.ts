import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserStatus } from '../../../database/enums';
import { Between, FindOptionsWhere, LessThan, Not } from 'typeorm';
import { User } from 'database/entities/user.entities';
import { DebtService } from '../debt/debt.service';
import { BillsService } from '../bills/bills.service';
import { ExpensesService } from '../expenses/expenses.service';
import {
  TDashboardDount,
  TDashboardStatistics,
  TMonthlyPoint,
  TUserManagementStatistics,
} from './dto/response.dto';
import { THourlyPeak } from '../../../database/queries/types';
import { THourCount } from './admin.types';
import { getHourlyPeakQuery } from '../../../database/queries/hourlyPeakQuery';
import {
  getMonthlyBillsSum,
  getMonthlyExpensesSum,
} from '../../../database/queries/monthlyStatistics';
import { MONTHES_NAMES } from '../../constants/months.constants';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly debtService: DebtService,
    private readonly billService: BillsService,
    private readonly expenseService: ExpensesService,
  ) {}

  async getDashboardStatistics(): Promise<TDashboardStatistics> {
    const totalDebts = await this.getTotalDebts();
    const activeUsersCount = await this.getActiveUsersCount();
    const totalUsersCount = await this.getTotalUsersCount();

    const activeUsersChangePercent = this.calcChangePercent(
      await this.getCumulativeActiveUsersUntilLastMonth(),
      activeUsersCount,
    );
    const totalUsersChangePercent = this.calcChangePercent(
      await this.getCumulativeUsersUntilLastMonth(),
      totalUsersCount,
    );
    const debtsChangePercent = this.calcChangePercent(
      await this.getCumulativeDebtsUntilLastMonth(),
      totalDebts,
    );

    return {
      activeUsers: {
        count: activeUsersCount,
        changePercent: activeUsersChangePercent,
      },
      totalUsers: {
        count: totalUsersCount,
        changePercent: totalUsersChangePercent,
      },
      debts: {
        count: totalDebts,
        changePercent: debtsChangePercent,
      },
    };
  }

  async getFinancialSnapShot(): Promise<TDashboardDount> {
    const [expensesTotal, revenuesTotal, debtsTotal] = await Promise.all([
      this.expenseService.getExpensesCount(),
      this.billService.getBillsCount(),
      this.debtService.getTotalDebtsWithWhere({}),
    ]);
    return this.buildDonutData(expensesTotal, revenuesTotal, debtsTotal);
  }

  async getPeakHourly() {
    const peakRows = await getHourlyPeakQuery();
    return this.toHourlyPairs(peakRows);
  }

  async getBillsVsExpensesMonthly(): Promise<TMonthlyPoint[]> {
    const [billsRows, expensesRows] = await Promise.all([
      getMonthlyBillsSum(),
      getMonthlyExpensesSum(),
    ]);

    const billsMap = new Map(billsRows.map((r) => [r.month, r.total]));
    const expensesMap = new Map(expensesRows.map((r) => [r.month, r.total]));

    return MONTHES_NAMES.map((m) => ({
      month: m,
      bills: billsMap.get(m) ?? 0,
      expenses: expensesMap.get(m) ?? 0,
    }));
  }

  async getUserManagementStatistics(): Promise<TUserManagementStatistics> {
    const activeUsersCount = await this.getActiveUsersCount();
    const uActiveUsersCount = await this.getUActiveUsersCount();
    const totalUsersCount = await this.getTotalUsersCount();

    // Using cumulative counts for Total/Active Users change percent
    const activeUsersChangePercent = this.calcChangePercent(
      await this.getCumulativeActiveUsersUntilLastMonth(),
      activeUsersCount,
    );
    const totalUsersChangePercent = this.calcChangePercent(
      await this.getCumulativeUsersUntilLastMonth(),
      totalUsersCount,
    );
    const uActiveUsersChangePercent = this.calcChangePercent(
      await this.getCumulativeUsersUntilLastMonth(true),
      uActiveUsersCount,
    );
    const newUsersCount = await this.getNewUsersCount();
    const newUsersChangePercent = this.calcChangePercent(
      await this.getNewUsersLastMonth(),
      newUsersCount,
    );
    return {
      newUsers: {
        count: newUsersCount,
        changePercent: newUsersChangePercent,
      },
      activeUsers: {
        count: activeUsersCount,
        changePercent: activeUsersChangePercent,
      },
      totalUsers: {
        count: totalUsersCount,
        changePercent: totalUsersChangePercent,
      },
      uActiveUsers: {
        count: uActiveUsersCount,
        changePercent: uActiveUsersChangePercent,
      },
    };
  }

  private async getNewUsersCount() {
    const now = new Date(Date.now());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const where: FindOptionsWhere<User> = {
      createdAt: Between(startOfMonth, startOfNextMonth),
    };
    return await this.userService.getUsersCountWithWhere(where);
  }

  private toHourlyPairs(rows: THourlyPeak): THourCount[] {
    const counts: number[] = Array<number>(24).fill(0);
    for (const r of rows) {
      if (r.hour >= 0 && r.hour <= 23) counts[r.hour] = r.count;
    }

    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      count: counts[i],
    }));
  }
  private async getUActiveUsersCount() {
    return await this.userService.getUsersCountWithWhere({
      status: Not(UserStatus.ACTIVE),
    });
  }

  private buildDonutData(
    expensesTotal: number,
    revenuesTotal: number,
    debtsTotal: number,
  ) {
    const expenses = Number(expensesTotal) || 0;
    const revenues = Number(revenuesTotal) || 0;
    const debts = Number(debtsTotal) || 0;

    const total = expenses + revenues + debts;

    const percentOf = (value: number) => {
      if (total === 0) return 0;
      return Math.round((value / total) * 1000) / 10;
    };

    return {
      expenses: { count: expenses, percentage: percentOf(expenses) },
      revenues: { count: revenues, percentage: percentOf(revenues) },
      debts: { count: debts, percentage: percentOf(debts) },
    };
  }

  private async getTotalDebts() {
    return await this.debtService.getTotalDebtsWithWhere({});
  }

  private async getActiveUsersCount() {
    return await this.userService.getUsersCountWithWhere({
      status: UserStatus.ACTIVE,
    });
  }

  private async getTotalUsersCount() {
    return await this.userService.getUsersCountWithWhere({});
  }

  private calcChangePercent(prevTotal: number, nowTotal: number): number {
    const prev = Number(prevTotal);
    const now = Number(nowTotal);

    if (!Number.isFinite(prev) || !Number.isFinite(now)) return 0;

    if (prev === 0) {
      if (now === 0) return 0;
      return 100;
    }

    const percent = ((now - prev) / prev) * 100;

    return Math.round(percent * 10) / 10;
  }

  private async getNewUsersLastMonth() {
    const where = this.getWhereInMonth();
    return await this.userService.getUsersCountWithWhere(where);
  }

  private async getCumulativeUsersUntilLastMonth(inactive = false) {
    const now = new Date();
    const startOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    const where: FindOptionsWhere<User> = {
      createdAt: LessThan(startOfThisMonth),
    };

    if (inactive) {
      // logic for inactive users if explicitly requested, but UActive likely stands for "Inactive" based on usage?
      // Wait, getUActiveUsersCount uses Not(UserStatus.ACTIVE).
      where.status = Not(UserStatus.ACTIVE);
    }

    return await this.userService.getUsersCountWithWhere(where);
  }

  private async getCumulativeActiveUsersUntilLastMonth() {
    const now = new Date();
    const startOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    return await this.userService.getUsersCountWithWhere({
      status: UserStatus.ACTIVE,
      createdAt: LessThan(startOfThisMonth),
    });
  }

  private async getCumulativeDebtsUntilLastMonth() {
    const now = new Date();
    const startOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    return await this.debtService.getTotalDebtsWithWhere({
      createdAt: LessThan(startOfThisMonth),
    });
  }

  private getWhereInMonth() {
    const now = new Date();
    const startOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
      0,
      0,
      0,
      0,
    );
    const startOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    return {
      createdAt: Between(startOfPrevMonth, startOfThisMonth),
    };
  }
}
