import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

import { Budget } from '../../../database/entities/budget.entities';
import { Debt } from '../../../database/entities/debts.entities';
import { FinancialInsight } from '../../../database/entities/financial-insight.entities';
import { BudgetCategory, DebtDirection } from '../../../database/enums';

import { GetFinancialReportDto } from './dto/request.dto';
import { FinancialReportResponseDto } from './dto/response.dto';

@Injectable()
export class FinancialReportService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    @InjectRepository(Debt)
    private readonly debtRepo: Repository<Debt>,
    @InjectRepository(FinancialInsight)
    private readonly insightRepo: Repository<FinancialInsight>,
  ) {}

  async getFinancialReport(
    userId: string,
    dto: GetFinancialReportDto,
  ): Promise<FinancialReportResponseDto> {
    const { startDate, endDate } = dto;

    // Get budgets in the period
    const budgets = await this.budgetRepo.find({
      where: {
        user_id: userId,
        start_date: LessThanOrEqual(endDate),
        end_date: MoreThanOrEqual(startDate),
        is_active: true,
      },
    });

    // Calculate category breakdown
    const categoryMap = new Map<
      BudgetCategory,
      { allocated: number; spent: number }
    >();

    budgets.forEach((budget) => {
      const existing = categoryMap.get(budget.category) || {
        allocated: 0,
        spent: 0,
      };
      categoryMap.set(budget.category, {
        allocated: existing.allocated + Number(budget.allocated_amount),
        spent: existing.spent + Number(budget.spent_amount),
      });
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, data]) => ({
        category,
        allocatedAmount: data.allocated.toFixed(2),
        spentAmount: data.spent.toFixed(2),
        remainingAmount: (data.allocated - data.spent).toFixed(2),
        utilizationPercentage:
          data.allocated > 0
            ? ((data.spent / data.allocated) * 100).toFixed(2)
            : '0.00',
      }),
    );

    // Get debts in the period
    const debts = await this.debtRepo.find({
      where: {
        userId,
        dueDate: Between(startDate, endDate),
      },
    });

    const totalDebtsOwed = debts
      .filter((d) => d.direction === DebtDirection.OWED_TO_ME)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const totalDebtsOwe = debts
      .filter((d) => d.direction === DebtDirection.I_OWE)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    // Calculate weekly expenses (mock for now - would need transaction data)
    const weeklyExpenses = this.calculateWeeklyExpenses(startDate, endDate);

    // Get insights
    const insights = await this.insightRepo.find({
      where: {
        user_id: userId,
        created_at: Between(startDate, endDate),
      },
      order: { created_at: 'DESC' },
      take: 5,
    });

    const insightsData = insights.map((insight) => ({
      insightType: insight.insight_type,
      title: insight.title,
      message: insight.message,
      category: insight.category ?? undefined,
      period: insight.period ?? undefined,
      isRead: insight.is_read,
      createdAt: insight.created_at.toISOString(),
    }));

    // Calculate totals
    const totalAllocated = budgets.reduce(
      (sum, b) => sum + Number(b.allocated_amount),
      0,
    );
    const totalSpent = budgets.reduce(
      (sum, b) => sum + Number(b.spent_amount),
      0,
    );

    return {
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary: {
        totalAllocated: totalAllocated.toFixed(2),
        totalSpent: totalSpent.toFixed(2),
        totalRemaining: (totalAllocated - totalSpent).toFixed(2),
        totalDebtsOwed: totalDebtsOwed.toFixed(2),
        totalDebtsOwe: totalDebtsOwe.toFixed(2),
        netWorth: (
          totalAllocated -
          totalSpent +
          totalDebtsOwed -
          totalDebtsOwe
        ).toFixed(2),
      },
      categoryBreakdown,
      weeklyExpenses,
      insights: insightsData,
    };
  }

  private calculateWeeklyExpenses(
    startDate: Date,
    endDate: Date,
  ): Array<{ week: string; amount: string }> {
    // Mock implementation - would need actual transaction data
    const weeks: Array<{ week: string; amount: string }> = [];
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const numWeeks = Math.ceil(daysDiff / 7);

    for (let i = 0; i < numWeeks; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + i * 7);
      weeks.push({
        week: `Week ${i + 1}`,
        amount: '0.00',
      });
    }

    return weeks;
  }

  async createInsight(
    userId: string,
    data: {
      insightType: string;
      title: string;
      message: string;
      category?: BudgetCategory;
      period?: string;
    },
  ) {
    const insight = this.insightRepo.create({
      user_id: userId,
      insight_type: data.insightType,
      title: data.title,
      message: data.message,
      category: data.category ?? null,
      period: data.period ?? null,
      is_read: false,
    });

    return this.insightRepo.save(insight);
  }

  async markInsightAsRead(insightId: string, userId: string) {
    const insight = await this.insightRepo.findOne({
      where: { id: insightId, user_id: userId },
    });

    if (!insight) {
      throw new Error('Insight not found');
    }

    insight.is_read = true;
    return this.insightRepo.save(insight);
  }
}
