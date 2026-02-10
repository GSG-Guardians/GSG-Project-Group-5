import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateIncomeDto } from './dto/request.dto';
import { IncomeResponseDto } from './dto/response.dto';

import { Income } from '../../../database/entities/income.entities';
import { User } from '../../../database/entities/user.entities';
import { Asset } from '../../../database/entities/assets.entities';
import { Currency } from '../../../database/entities/currency.entities';
import { IncomeRecurringRule } from '../../../database/entities/income-recurring-rule.entities';
import { IncomeFrequency } from '../../../database/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from '../database/database.service';

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
}
