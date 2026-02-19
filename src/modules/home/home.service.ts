import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '../../../database/entities/currency.entities';
import { FinancialInsight } from '../../../database/entities/financial-insight.entities';
import { Asset } from '../../../database/entities/assets.entities';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ExpensesService } from '../expenses/expenses.service';
import type { UserResponseDto } from '../user/dto';
import type {
  HomeAttentionNeededItem,
  HomeOverviewResponseDto,
} from './dto/response.dto';

@Injectable()
export class HomeService {
  constructor(
    private readonly expensesService: ExpensesService,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(FinancialInsight)
    private readonly financialInsightRepository: Repository<FinancialInsight>,
  ) {}

  async getOverview(user: UserResponseDto): Promise<HomeOverviewResponseDto> {
    if (!user.defaultCurrencyId) {
      throw new NotFoundException('Default currency not found');
    }

    const currency = await this.currencyRepository.findOne({
      where: { id: user.defaultCurrencyId },
    });

    if (!currency) {
      throw new NotFoundException('Default currency not found');
    }

    const overview = await this.expensesService.getOverview(user, {
      period: 'month',
    });

    const { startDate, endDate } = this.getCurrentMonthDateRange();

    const insights = await this.financialInsightRepository.find({
      where: {
        user_id: user.id,
        period_start: LessThanOrEqual(endDate),
        period_end: MoreThanOrEqual(startDate),
      },
      order: {
        is_read: 'ASC',
        createdAt: 'DESC',
      },
      take: 3,
    });

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        avatarUrl: this.resolveAvatarUrl(user.avatar),
      },
      currency: {
        id: currency.id,
        code: currency.code,
        symbol: currency.symbol,
        name: currency.name,
      },
      balance: {
        current: user.currentBalance,
      },
      expenseDue: {
        amount: overview.totalExpenses,
        periodLabel: 'current_month',
        startDate: this.formatDate(startDate),
        endDate: this.formatDate(endDate),
      },
      attentionNeeded: insights.map((insight) => this.toAttentionItem(insight)),
    };
  }

  private toAttentionItem(insight: FinancialInsight): HomeAttentionNeededItem {
    return {
      id: insight.id,
      type: insight.insight_type,
      title: insight.title,
      message: insight.message,
      isRead: insight.is_read,
      progressPercent: this.resolveProgressPercent(
        insight.insight_type,
        insight.message,
      ),
      createdAt: insight.createdAt,
    };
  }

  private resolveAvatarUrl(assets: Asset[] | null): string | null {
    if (!assets || assets.length === 0) {
      return null;
    }

    const avatar = assets.find(
      (asset) => typeof asset.url === 'string' && asset.url.trim().length > 0,
    );
    return avatar?.url ?? null;
  }

  private resolveProgressPercent(type: string, message: string): number {
    const percentMatch = message.match(/(\d+(?:\.\d+)?)\s*%/);
    if (percentMatch) {
      const parsed = Number(percentMatch[1]);
      if (!Number.isNaN(parsed)) {
        return this.clampPercent(parsed);
      }
    }

    const normalizedType = type.toLowerCase();
    if (normalizedType === 'warning') {
      return 100;
    }
    if (normalizedType === 'alert') {
      return 85;
    }
    if (normalizedType === 'recommendation' || normalizedType === 'info') {
      return 65;
    }
    return 50;
  }

  private clampPercent(value: number): number {
    return Math.min(100, Math.max(0, value));
  }

  private getCurrentMonthDateRange() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate, endDate };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
