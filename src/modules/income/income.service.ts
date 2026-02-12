import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository, In } from 'typeorm';

import {
  CreateIncomeDto,
  IncomePeriod,
  UpdateIncomeDto,
} from './dto/request.dto';
import {
  IncomeBreakdownDto,
  IncomeResponseDto,
  IncomeSummaryDto,
} from './dto/response.dto';

import { Income } from '../../../database/entities/income.entities';
import { User } from '../../../database/entities/user.entities';
import { Asset } from '../../../database/entities/assets.entities';
import { Currency } from '../../../database/entities/currency.entities';
import { IncomeRecurringRule } from '../../../database/entities/income-recurring-rule.entities';
import { IncomeFrequency, IncomeSource } from '../../../database/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from '../database/database.service';
import { IPaginationQuery } from 'src/types/pagination.types';
import { FilterIncomeDto } from './dto/filter-income.dto';
import { ILike } from 'typeorm';
import { IMetaPagination } from 'src/types/pagination.types';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,
    private readonly databaseService: DatabaseService,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) {}

  async create(
    userId: string,
    dto: CreateIncomeDto,
  ): Promise<IncomeResponseDto> {
    if (!userId) throw new BadRequestException('Missing user id');

    const frequency = dto.frequency ?? IncomeFrequency.ONE_TIME;

    return this.incomeRepo.manager.transaction(async (manager) => {
      const user = await manager
        .getRepository(User)
        .findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const currency = await manager
        .getRepository(Currency)
        .findOne({ where: { id: dto.currencyId } });
      if (!currency) throw new NotFoundException('Currency not found');

      if (dto.assetId) {
        const asset = await manager
          .getRepository(Asset)
          .findOne({ where: { id: dto.assetId } });
        if (!asset) throw new NotFoundException('Asset not found');
      }

      const income = manager.getRepository(Income).create({
        userId,
        amount: dto.amount.toString(),
        currencyId: dto.currencyId,
        source: dto.source,
        description: dto.description ?? null,
        incomeDate: dto.incomeDate,
        assetId: dto.assetId ?? null,
      });

      const savedIncome = await manager.getRepository(Income).save(income);

      if (frequency !== IncomeFrequency.ONE_TIME) {
        const recurringRule = manager
          .getRepository(IncomeRecurringRule)
          .create({
            incomeId: savedIncome.id,
            frequency,
            active: dto.isRecurringActive ?? true,
            nextRunAt: dto.incomeDate,
            endAt: dto.endAt ?? null,
          });

        await manager.getRepository(IncomeRecurringRule).save(recurringRule);
      }

      return {
        id: savedIncome.id,
        amount: Number(savedIncome.amount),
        currencyId: savedIncome.currencyId,
        source: savedIncome.source,
        incomeDate: savedIncome.incomeDate,
        frequency,
        description: savedIncome.description ?? null,
        assetId: savedIncome.assetId ?? null,
        createdAt: savedIncome.createdAt,
      };
    });
  }

  async findAll(
    userId: string,
    query: IPaginationQuery,
    filter: FilterIncomeDto,
  ): Promise<{ data: IncomeResponseDto[]; meta: IMetaPagination }> {
    if (!userId) throw new BadRequestException('Missing user id');

    const { skip, take, page, limit } =
      this.databaseService.createPaginationOptions(query);

    const where: FindOptionsWhere<Income> = { userId };

    if (filter.source) where.source = filter.source;
    if (filter.currencyId) where.currencyId = filter.currencyId;
    if (filter.assetId) where.assetId = filter.assetId;
    if (filter.incomeDate) where.incomeDate = filter.incomeDate;

    if (filter.description) {
      where.description = ILike(`%${filter.description}%`);
    }

    const [incomes, total] = await this.incomeRepo.findAndCount({
      where,
      order: { incomeDate: 'DESC', createdAt: 'DESC' },
      skip,
      take,
    });

    const incomeIds = incomes.map((i) => i.id);

    const rules = incomeIds.length
      ? await this.incomeRepo.manager
          .getRepository(IncomeRecurringRule)
          .createQueryBuilder('r')
          .select('r.incomeId', 'incomeId')
          .addSelect('r.frequency', 'frequency')
          .where('r.incomeId IN (:...ids)', { ids: incomeIds })
          .andWhere('r.active = true')
          .getRawMany<{ incomeId: string; frequency: IncomeFrequency }>()
      : [];

    const freqMap = new Map<string, IncomeFrequency>();
    for (const r of rules) {
      if (!freqMap.has(r.incomeId)) {
        freqMap.set(r.incomeId, r.frequency);
      }
    }

    const data: IncomeResponseDto[] = incomes.map((i) => ({
      id: i.id,
      amount: Number(i.amount),
      currencyId: i.currencyId,
      source: i.source,
      incomeDate: i.incomeDate,
      frequency: freqMap.get(i.id) ?? IncomeFrequency.ONE_TIME,
      description: i.description,
      assetId: i.assetId,
      createdAt: i.createdAt,
    }));

    const meta = this.databaseService.createPaginationMetaData(
      limit,
      page,
      total,
    );

    return { data, meta };
  }

  async getIncomeSummary(userId: string): Promise<IncomeSummaryDto> {
    if (!userId) throw new BadRequestException('Missing user id');

    const { currentStart, currentEndExclusive, prevStart, prevEndExclusive } =
      this.getMonthRangeUTC(new Date());

    const qb = this.incomeRepo.createQueryBuilder('i');

    const currentTotalRow = await qb
      .clone()
      .select('COALESCE(SUM(i.amount), 0)', 'total')
      .where('i.userId = :userId', { userId })
      .andWhere('i.incomeDate >= :start', { start: currentStart })
      .andWhere('i.incomeDate < :end', { end: currentEndExclusive })
      .getRawOne<{ total: string }>();

    const prevTotalRow = await qb
      .clone()
      .select('COALESCE(SUM(i.amount), 0)', 'total')
      .where('i.userId = :userId', { userId })
      .andWhere('i.incomeDate >= :start', { start: prevStart })
      .andWhere('i.incomeDate < :end', { end: prevEndExclusive })
      .getRawOne<{ total: string }>();

    const topSourceRow = await qb
      .clone()
      .select('i.source', 'source')
      .addSelect('COALESCE(SUM(i.amount), 0)', 'total')
      .where('i.userId = :userId', { userId })
      .andWhere('i.incomeDate >= :start', { start: currentStart })
      .andWhere('i.incomeDate < :end', { end: currentEndExclusive })
      .groupBy('i.source')
      .orderBy('SUM(i.amount)', 'DESC')
      .limit(1)
      .getRawOne<{ source: IncomeSource; total: string }>();

    const currentTotal = Number(currentTotalRow?.total ?? 0);
    const prevTotal = Number(prevTotalRow?.total ?? 0);

    return {
      totalIncome: currentTotal,
      percentChangeVsPreviousPeriod: this.calcPercentChange(
        currentTotal,
        prevTotal,
      ),
      topSource: topSourceRow?.source ?? null,
      topSourceAmount: Number(topSourceRow?.total ?? 0),
    };
  }

  private getRangeUTC(period: IncomePeriod | undefined): {
    start: string;
    endExclusive: string;
  } {
    const p: IncomePeriod = period ?? 'month';
    const now = new Date();

    const y = now.getUTCFullYear();
    const m = now.getUTCMonth();

    if (p === 'month') {
      const start = new Date(Date.UTC(y, m, 1));
      const endExclusive = new Date(Date.UTC(y, m + 1, 1));
      return {
        start: this.toYMD(start),
        endExclusive: this.toYMD(endExclusive),
      };
    }

    if (p === 'year') {
      const start = new Date(Date.UTC(y, 0, 1));
      const endExclusive = new Date(Date.UTC(y + 1, 0, 1));
      return {
        start: this.toYMD(start),
        endExclusive: this.toYMD(endExclusive),
      };
    }

    // week: last 7 days including today (UTC)
    const todayUTC = new Date(Date.UTC(y, m, now.getUTCDate()));
    const start = new Date(todayUTC);
    start.setUTCDate(start.getUTCDate() - 6);
    const endExclusive = new Date(todayUTC);
    endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

    return { start: this.toYMD(start), endExclusive: this.toYMD(endExclusive) };
  }

  async getBreakdown(
    userId: string,
    period?: IncomePeriod,
  ): Promise<IncomeBreakdownDto> {
    if (!userId) throw new BadRequestException('Missing user id');

    const { start, endExclusive } = this.getRangeUTC(period);

    const rows = await this.incomeRepo
      .createQueryBuilder('i')
      .select('i.source', 'source')
      .addSelect('COALESCE(SUM(i.amount), 0)', 'total')
      .where('i.userId = :userId', { userId })
      .andWhere('i.incomeDate >= :start', { start })
      .andWhere('i.incomeDate < :end', { end: endExclusive })
      .groupBy('i.source')
      .orderBy('SUM(i.amount)', 'DESC')
      .getRawMany<{ source: IncomeSource; total: string }>();

    const totalIncome = rows.reduce((acc, r) => acc + Number(r.total ?? 0), 0);

    const items = rows.map((r) => {
      const amount = Number(r.total ?? 0);
      const percentage = totalIncome === 0 ? 0 : (amount / totalIncome) * 100;
      return {
        source: r.source,
        amount,
        percentage: Number(percentage.toFixed(2)),
      };
    });

    return { totalIncome, items };
  }

  async getRecent(userId: string, limit = 3): Promise<IncomeResponseDto[]> {
    if (!userId) throw new BadRequestException('Missing user id');

    const take = Math.min(20, Math.max(1, Number(limit) || 3));

    const incomes = await this.incomeRepo.find({
      where: { userId },
      order: { incomeDate: 'DESC', createdAt: 'DESC' },
      take,
    });

    const ids = incomes.map((i) => i.id);
    const rules = ids.length
      ? await this.incomeRepo.manager.getRepository(IncomeRecurringRule).find({
          where: { incomeId: In(ids), active: true },
        })
      : [];

    const freqMap = new Map<string, IncomeFrequency>();
    for (const r of rules) {
      if (!freqMap.has(r.incomeId)) freqMap.set(r.incomeId, r.frequency);
    }

    return incomes.map((i) => ({
      id: i.id,
      amount: Number(i.amount),
      currencyId: i.currencyId,
      source: i.source,
      incomeDate: i.incomeDate,
      frequency: freqMap.get(i.id) ?? IncomeFrequency.ONE_TIME,
      description: i.description,
      assetId: i.assetId,
      createdAt: i.createdAt,
    }));
  }

  async getChart(
    userId: string,
    period?: IncomePeriod,
  ): Promise<{ label: string; total: number }[]> {
    if (!userId) throw new BadRequestException('Missing user id');

    const { start, endExclusive } = this.getRangeUTC(period);
    const p: IncomePeriod = period ?? 'month';

    const generateLabels = () => {
      const labels: string[] = [];
      const startDate = new Date(start);
      const endDate = new Date(endExclusive);

      if (p === 'year') {
        const current = new Date(startDate);
        while (current < endDate) {
          labels.push(current.toISOString().slice(0, 7)); // YYYY-MM
          current.setUTCMonth(current.getUTCMonth() + 1);
        }
      } else {
        const current = new Date(startDate);
        while (current < endDate) {
          labels.push(current.toISOString().slice(0, 10)); // YYYY-MM-DD
          current.setUTCDate(current.getUTCDate() + 1);
        }
      }
      return labels;
    };

    const allLabels = generateLabels();
    const map = new Map<string, number>();
    allLabels.forEach((l) => map.set(l, 0));

    if (p === 'year') {
      const rows = await this.incomeRepo
        .createQueryBuilder('i')
        .select(`TO_CHAR(i.incomeDate::date, 'YYYY-MM')`, 'label')
        .addSelect('COALESCE(SUM(i.amount), 0)', 'total')
        .where('i.userId = :userId', { userId })
        .andWhere('i.incomeDate >= :start', { start })
        .andWhere('i.incomeDate < :end', { end: endExclusive })
        .groupBy(`TO_CHAR(i.incomeDate::date, 'YYYY-MM')`)
        .getRawMany<{ label: string; total: string }>();

      rows.forEach((r) => map.set(r.label, Number(r.total)));
    } else {
      const rows = await this.incomeRepo
        .createQueryBuilder('i')
        .select(`i.incomeDate`, 'label')
        .addSelect('COALESCE(SUM(i.amount), 0)', 'total')
        .where('i.userId = :userId', { userId })
        .andWhere('i.incomeDate >= :start', { start })
        .andWhere('i.incomeDate < :end', { end: endExclusive })
        .groupBy('i.incomeDate')
        .getRawMany<{ label: string | Date; total: string }>();

      rows.forEach((r) => {
        const label =
          typeof r.label === 'string'
            ? r.label
            : r.label.toISOString().slice(0, 10);
        map.set(label, Number(r.total));
      });
    }

    return Array.from(map.entries()).map(([label, total]) => ({
      label,
      total,
    }));
  }

  async findOne(userId: string, id: string): Promise<IncomeResponseDto> {
    if (!userId) throw new BadRequestException('Missing user id');

    const income = await this.incomeRepo.findOne({ where: { id, userId } });
    if (!income) throw new NotFoundException('Income not found');

    const rule = await this.incomeRepo.manager
      .getRepository(IncomeRecurringRule)
      .findOne({
        where: { incomeId: income.id, active: true },
      });

    return {
      id: income.id,
      amount: Number(income.amount),
      currencyId: income.currencyId,
      source: income.source,
      incomeDate: income.incomeDate,
      frequency: rule?.frequency ?? IncomeFrequency.ONE_TIME,
      description: income.description,
      assetId: income.assetId,
      createdAt: income.createdAt,
    };
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateIncomeDto,
  ): Promise<IncomeResponseDto> {
    if (!userId) throw new BadRequestException('Missing user id');

    const income = await this.incomeRepo.findOne({
      where: { id, userId },
    });
    if (!income) throw new NotFoundException('Income not found');

    const effectiveIncomeDate = dto.incomeDate ?? income.incomeDate;
    const existingRule = await this.incomeRepo.manager
      .getRepository(IncomeRecurringRule)
      .findOne({ where: { incomeId: id } });

    const effectiveFrequency =
      dto.frequency ?? (existingRule?.frequency || IncomeFrequency.ONE_TIME);
    const finalEndAt =
      dto.endAt !== undefined ? dto.endAt : (existingRule?.endAt ?? null);

    if (effectiveFrequency !== IncomeFrequency.ONE_TIME && finalEndAt) {
      const start = new Date(effectiveIncomeDate);
      const end = new Date(finalEndAt);
      if (end <= start) {
        throw new BadRequestException('End date must be after income date');
      }
    }

    return this.incomeRepo.manager.transaction(async (manager) => {
      if (dto.amount !== undefined) income.amount = dto.amount.toString();
      if (dto.currencyId !== undefined) income.currencyId = dto.currencyId;
      if (dto.source !== undefined) income.source = dto.source;
      if (dto.description !== undefined) income.description = dto.description;
      if (dto.incomeDate !== undefined) income.incomeDate = dto.incomeDate;
      if (dto.assetId !== undefined) income.assetId = dto.assetId;

      const savedIncome = await manager.save(income);

      if (effectiveFrequency === IncomeFrequency.ONE_TIME) {
        if (existingRule && existingRule.active) {
          existingRule.active = false;
          await manager.save(existingRule);
        }
      } else {
        if (existingRule) {
          existingRule.frequency = effectiveFrequency;
          if (dto.isRecurringActive !== undefined) {
            existingRule.active = dto.isRecurringActive;
          }
          if (dto.incomeDate !== undefined) {
            existingRule.nextRunAt = dto.incomeDate;
          }
          if (dto.endAt !== undefined) {
            existingRule.endAt = dto.endAt;
          }
          await manager.save(existingRule);
        } else {
          const newRule = manager.getRepository(IncomeRecurringRule).create({
            incomeId: id,
            frequency: effectiveFrequency,
            active: dto.isRecurringActive ?? true,
            nextRunAt: effectiveIncomeDate,
            endAt: finalEndAt,
          });
          await manager.save(newRule);
        }
      }

      return {
        id: savedIncome.id,
        amount: Number(savedIncome.amount),
        currencyId: savedIncome.currencyId,
        source: savedIncome.source,
        incomeDate: savedIncome.incomeDate,
        frequency: effectiveFrequency,
        description: savedIncome.description,
        assetId: savedIncome.assetId,
        createdAt: savedIncome.createdAt,
      };
    });
  }

  async remove(userId: string, id: string): Promise<{ success: true }> {
    if (!userId) throw new BadRequestException('Missing user id');

    const res = await this.incomeRepo.delete({ id, userId });
    if (!res.affected) throw new NotFoundException('Income not found');

    return { success: true };
  }

  private toYMD(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private getMonthRangeUTC(base: Date) {
    const y = base.getUTCFullYear();
    const m = base.getUTCMonth();

    const currentStart = new Date(Date.UTC(y, m, 1));
    const currentEndExclusive = new Date(Date.UTC(y, m + 1, 1));

    const prevStart = new Date(Date.UTC(y, m - 1, 1));
    const prevEndExclusive = currentStart;

    return {
      currentStart: this.toYMD(currentStart),
      currentEndExclusive: this.toYMD(currentEndExclusive),
      prevStart: this.toYMD(prevStart),
      prevEndExclusive: this.toYMD(prevEndExclusive),
    };
  }

  private calcPercentChange(current: number, previous: number): number {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  }
}
