import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../../../database/entities/expense.entities';
import { Income } from '../../../database/entities/income.entities';
import { User } from '../../../database/entities/user.entities';
import { CategoryName } from '../../../database/enums';
import type { UserResponseDto } from '../user/dto';
import type {
  ExpenseCategoryBreakdown,
  ExpenseCategoryOption,
  ExpenseDonutSegment,
  ExpenseOverviewResponse,
  ExpenseResponse,
} from './dto/response.dto';
import type {
  TCreateExpenseRequest,
  TExpenseCategoryQuery,
  TExpensePeriodQuery,
} from './dto/request.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getOverview(
    user: UserResponseDto,
    query: TExpensePeriodQuery,
  ): Promise<ExpenseOverviewResponse> {
    const currencyId = query.currencyId ?? user.defaultCurrencyId;
    const range = this.resolveDateRange(query);

    const totalExpenses = await this.getTotalAmount(
      this.expenseRepository,
      'expense',
      'dueDate',
      user.id,
      currencyId,
      range,
    );
    const totalIncome = await this.getTotalAmount(
      this.incomeRepository,
      'income',
      'incomeDate',
      user.id,
      currencyId,
      range,
    );

    return {
      totalBalance: user.currentBalance,
      totalIncome,
      totalExpenses,
    };
  }

  async getCategoryBreakdown(
    user: UserResponseDto,
    query: TExpensePeriodQuery,
  ): Promise<ExpenseCategoryBreakdown[]> {
    const currencyId = query.currencyId ?? user.defaultCurrencyId;
    const range = this.resolveDateRange(query);
    const totals = await this.getTotalsByCategory(user.id, currencyId, range);

    return totals.breakdown;
  }

  async getDonutChart(
    user: UserResponseDto,
    query: TExpensePeriodQuery,
  ): Promise<ExpenseDonutSegment[]> {
    const currencyId = query.currencyId ?? user.defaultCurrencyId;
    const range = this.resolveDateRange(query);
    const totals = await this.getTotalsByCategory(user.id, currencyId, range);

    return totals.segments;
  }

  async getExpenseCategories(
    user: UserResponseDto,
    query: TExpenseCategoryQuery,
  ): Promise<ExpenseCategoryOption[]> {
    const currencyId = query.currencyId ?? user.defaultCurrencyId;
    const range = this.resolveDateRange(query);
    const totals = await this.getTotalsByCategory(user.id, currencyId, range);

    return totals.categories;
  }

  async createExpense(
    user: UserResponseDto,
    dto: TCreateExpenseRequest,
  ): Promise<ExpenseResponse> {
    const owner = await this.userRepository.findOne({ where: { id: user.id } });
    if (!owner) {
      throw new NotFoundException('User not found');
    }

    const expense = this.expenseRepository.create({
      userId: owner.id,
      user: owner,
      name: dto.name,
      amount: dto.amount.toString(),
      currencyId: dto.currencyId,
      category: dto.category ?? CategoryName.OTHER,
      dueDate: dto.dueDate,
      description: dto.description ?? null,
      assetId: dto.assetId ?? null,
    });

    const saved = await this.expenseRepository.save(expense);

    const nextBalance = Number(owner.currentBalance) - dto.amount;
    owner.currentBalance = nextBalance.toFixed(2);
    await this.userRepository.save(owner);

    return this.toExpenseResponse(saved);
  }

  async getExpensesCount() {
    return await this.expenseRepository.count();
  }
  private async getTotalsByCategory(
    userId: string,
    currencyId: string,
    range: DateRange,
  ) {
    const qb = this.expenseRepository
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.currencyId = :currencyId', { currencyId });

    this.applyDateFilter(qb, 'expense', 'dueDate', range);

    const rawTotals = await qb.groupBy('expense.category').getRawMany<{
      category: CategoryName;
      total: string;
    }>();

    const totalsMap = new Map<CategoryName, number>();
    for (const row of rawTotals) {
      totalsMap.set(row.category, Number(row.total ?? 0));
    }

    const categories = [
      CategoryName.FOOD,
      CategoryName.TRANSPORT,
      CategoryName.ENTERTAINMENT,
      CategoryName.HEALTH,
      CategoryName.HOUSING,
      CategoryName.OTHER,
    ];
    const totalExpenses = categories.reduce(
      (sum, category) => sum + (totalsMap.get(category) ?? 0),
      0,
    );

    const breakdown = categories.map((category) => {
      const amount = totalsMap.get(category) ?? 0;
      const percentage = this.calculatePercentage(amount, totalExpenses);
      return {
        category,
        totalAmount: amount.toFixed(2),
        percentage,
      };
    });

    return {
      breakdown,
      segments: breakdown.map((item) => ({
        category: item.category,
        totalAmount: item.totalAmount,
        percentage: item.percentage,
      })),
      categories: breakdown.map((item) => ({
        category: item.category,
        percentage: item.percentage,
      })),
    };
  }

  private async getTotalAmount(
    repository: Repository<Expense | Income>,
    alias: string,
    dateField: string,
    userId: string,
    currencyId: string,
    range: DateRange,
  ): Promise<string> {
    const qb = repository
      .createQueryBuilder(alias)
      .select(`COALESCE(SUM(${alias}.amount), 0)`, 'total')
      .where(`${alias}.userId = :userId`, { userId })
      .andWhere(`${alias}.currencyId = :currencyId`, { currencyId });

    this.applyDateFilter(qb, alias, dateField, range);

    const result = await qb.getRawOne<{ total: string }>();
    return Number(result?.total ?? 0).toFixed(2);
  }

  private resolveDateRange(query: {
    from?: Date;
    to?: Date;
    period?: 'day' | 'week' | 'month' | 'year';
    month?: number;
  }): DateRange {
    if (query.from && query.to) {
      return {
        from: this.formatDate(query.from),
        to: this.formatDate(query.to),
      };
    }

    if (!query.period) {
      return {};
    }

    const now = new Date();
    let start: Date;
    let end: Date;

    switch (query.period) {
      case 'day':
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week': {
        const day = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      }
      case 'month': {
        const month = query.month ?? now.getMonth() + 1;
        const year = now.getFullYear();
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0);
        end.setHours(23, 59, 59, 999);
        break;
      }
      case 'year':
      default: {
        const year = now.getFullYear();
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      }
    }

    return {
      from: this.formatDate(start),
      to: this.formatDate(end),
    };
  }

  private applyDateFilter(
    qb: ReturnType<Repository<Expense | Income>['createQueryBuilder']>,
    alias: string,
    dateField: string,
    range: DateRange,
  ) {
    if (!range.from || !range.to) {
      return;
    }

    qb.andWhere(`${alias}.${dateField} BETWEEN :from AND :to`, {
      from: range.from,
      to: range.to,
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private calculatePercentage(amount: number, total: number): number {
    if (total <= 0) {
      return 0;
    }
    return Number(((amount / total) * 100).toFixed(2));
  }

  private toExpenseResponse(expense: Expense): ExpenseResponse {
    return {
      id: expense.id,
      userId: expense.userId,
      name: expense.name,
      amount: expense.amount,
      currencyId: expense.currencyId,
      category: expense.category,
      dueDate: expense.dueDate,
      description: expense.description,
      assetId: expense.assetId,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }
}

type DateRange = {
  from?: string;
  to?: string;
};
