import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Income } from '../../../database/entities/income.entities';
import { Currency } from '../../../database/entities/currency.entities';
import { DatabaseService } from '../database/database.service';
import { CreateIncomeDto, FilterIncomeDto, UpdateIncomeDto } from './dto';
import { IncomeResponseDto } from './dto/response.dto';
import {
  IPaginationQuery,
  IPaginationResult,
} from '../../types/pagination.types';
import { toIncomeResponse } from './mappers/income.mapper';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(
    userId: string,
    dto: CreateIncomeDto,
  ): Promise<IncomeResponseDto> {
    const currency = await this.currencyRepo.findOne({
      where: { id: dto.currencyId },
    });
    if (!currency) throw new BadRequestException('Invalid currency ID');

    const income = this.incomeRepo.create({
      userId,
      amount: dto.amount,
      currencyId: dto.currencyId,
      source: dto.source,
      description: dto.description ?? null,
      incomeDate: dto.incomeDate,
      assetId: dto.assetId ?? null,
    });

    const saved = await this.incomeRepo.save(income);
    return toIncomeResponse(saved);
  }

  async findOne(id: string, userId: string): Promise<IncomeResponseDto> {
    const income = await this.incomeRepo.findOne({ where: { id, userId } });
    if (!income) throw new NotFoundException('Income not found');
    return toIncomeResponse(income);
  }

  async findAll(
    userId: string,
    query: IPaginationQuery,
    filter?: FilterIncomeDto,
  ): Promise<IPaginationResult<IncomeResponseDto>> {
    const { page, limit, skip, take } =
      this.databaseService.createPaginationOptions(query);

    const where: Record<string, unknown> = { userId };

    if (filter?.source) {
      where.source = filter.source;
    }

    if (filter?.currencyId) {
      where.currencyId = filter.currencyId;
    }

    if (filter?.startDate && filter?.endDate) {
      where.incomeDate = Between(filter.startDate, filter.endDate);
    }

    const [rows, total] = await this.incomeRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      data: rows.map(toIncomeResponse),
      meta: this.databaseService.createPaginationMetaData(limit, page, total),
    };
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateIncomeDto,
  ): Promise<IncomeResponseDto> {
    const income = await this.incomeRepo.findOne({ where: { id, userId } });
    if (!income) throw new NotFoundException('Income not found');

    if (dto.currencyId !== undefined) {
      const currency = await this.currencyRepo.findOne({
        where: { id: dto.currencyId },
      });
      if (!currency) throw new BadRequestException('Invalid currency ID');
      income.currencyId = dto.currencyId;
    }

    if (dto.amount !== undefined) {
      income.amount = dto.amount;
    }
    if (dto.source !== undefined) {
      income.source = dto.source;
    }
    if (dto.description !== undefined) {
      income.description = dto.description ?? null;
    }
    if (dto.incomeDate !== undefined) {
      income.incomeDate = dto.incomeDate;
    }
    if (dto.assetId !== undefined) {
      income.assetId = dto.assetId ?? null;
    }

    const saved = await this.incomeRepo.save(income);
    return toIncomeResponse(saved);
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<{ data: null; message: string }> {
    const exists = await this.incomeRepo.exists({ where: { id, userId } });
    if (!exists) throw new NotFoundException('Income not found');

    await this.incomeRepo.delete({ id });
    return { data: null, message: 'Income deleted successfully' };
  }

  async getIncomeSummary(userId: string): Promise<{
    totalIncome: string;
    count: number;
  }> {
    const incomes = await this.incomeRepo.find({ where: { userId } });
    const totalIncome = incomes.reduce((sum, income) => {
      return sum + Number(income.amount);
    }, 0);

    return {
      totalIncome: totalIncome.toFixed(2),
      count: incomes.length,
    };
  }
}
