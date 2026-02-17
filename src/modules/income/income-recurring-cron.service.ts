import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomeRecurringRule } from 'database/entities/income-recurring-rule.entities';
import { Income } from 'database/entities/income.entities';
import { IncomeFrequency } from 'database/enums';
import { IsNull, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class IncomeRecurringCronService {
  private readonly logger = new Logger(IncomeRecurringCronService.name);

  constructor(
    @InjectRepository(IncomeRecurringRule)
    private readonly recurringRuleRepo: Repository<IncomeRecurringRule>,
    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async materializeRecurringIncomes(): Promise<void> {
    const today = this.getTodayISO();

    const dueRules = await this.recurringRuleRepo.find({
      where: {
        active: true,
        nextRunAt: LessThanOrEqual(today),
      },
      relations: ['income'],
    });

    if (dueRules.length === 0) {
      return;
    }

    let createdCount = 0;

    for (const rule of dueRules) {
      if (!rule.income) {
        rule.active = false;
        await this.recurringRuleRepo.save(rule);
        continue;
      }

      if (rule.endAt && rule.nextRunAt > rule.endAt) {
        rule.active = false;
        await this.recurringRuleRepo.save(rule);
        continue;
      }

      const existing = await this.incomeRepo.findOne({
        where: {
          userId: rule.income.userId,
          incomeDate: rule.nextRunAt,
          amount: rule.income.amount,
          source: rule.income.source,
          currencyId: rule.income.currencyId,
          assetId: rule.income.assetId ?? IsNull(),
          description: rule.income.description ?? IsNull(),
        },
      });

      if (!existing) {
        const newIncome = this.incomeRepo.create({
          userId: rule.income.userId,
          amount: rule.income.amount,
          currencyId: rule.income.currencyId,
          source: rule.income.source,
          description: rule.income.description ?? null,
          incomeDate: rule.nextRunAt,
          assetId: rule.income.assetId ?? null,
        });
        await this.incomeRepo.save(newIncome);
        createdCount += 1;
      }

      if (rule.frequency === IncomeFrequency.ONE_TIME) {
        rule.active = false;
      } else {
        const nextRun = this.computeNextRunAt(rule.nextRunAt, rule.frequency);
        if (rule.endAt && nextRun > rule.endAt) {
          rule.active = false;
        } else {
          rule.nextRunAt = nextRun;
        }
      }

      await this.recurringRuleRepo.save(rule);
    }

    if (createdCount > 0) {
      this.logger.log(
        `Created ${createdCount} recurring income(s) for ${today}`,
      );
    }
  }

  private getTodayISO(): string {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return now.toISOString().slice(0, 10);
  }

  private computeNextRunAt(
    fromDateISO: string,
    frequency: IncomeFrequency,
  ): string {
    const [year, month, day] = fromDateISO.split('-').map(Number);
    const base = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));

    if (frequency === IncomeFrequency.WEEKLY) {
      base.setUTCDate(base.getUTCDate() + 7);
    } else if (frequency === IncomeFrequency.MONTHLY) {
      base.setUTCMonth(base.getUTCMonth() + 1);
    } else if (frequency === IncomeFrequency.YEARLY) {
      base.setUTCFullYear(base.getUTCFullYear() + 1);
    }

    return base.toISOString().slice(0, 10);
  }
}
