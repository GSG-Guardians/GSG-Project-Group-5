import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Debt } from '../../../database/entities/debts.entities';
import { Currency } from '../../../database/entities/currency.entities';
import { DatabaseService } from '../database/database.service';
import { UserService } from '../user/user.service';
import { DebtDirection, DebtStatus } from '../../../database/enums';
import { CreateDebtDto, UpdateDebtDto, FilterDebtDto } from './dto/request.dto';
import { DebtResponseDto } from './dto/response.dto';
import {
  IPaginationQuery,
  IPaginationResult,
} from '../../types/pagination.types';
import { toDebtResponse } from './mappers/debt.mapper';

@Injectable()
export class DebtService {
  constructor(
    @InjectRepository(Debt) private readonly debtRepo: Repository<Debt>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, dto: CreateDebtDto): Promise<DebtResponseDto> {
    const user = await this.userService.findOne(userId);

    const debt = this.debtRepo.create({
      userId,
      personalName: dto.personalName,
      direction: dto.direction,
      amount: dto.amount,
      currencyId: user.defaultCurrencyId,
      dueDate: dto.dueDate,
      description: dto.description ?? null,
      reminderEnabled: dto.reminderEnabled ?? false,
      remindAt: dto.remindAt ?? null,
      assetId: dto.assetId ?? null,
    });

    const saved = await this.debtRepo.save(debt);
    return toDebtResponse(saved);
  }

  async findOne(id: string, userId: string): Promise<DebtResponseDto> {
    const debt = await this.debtRepo.findOne({ where: { id, userId } });
    if (!debt) throw new NotFoundException('Debt not found');
    return toDebtResponse(debt);
  }

  async findAll(
    userId: string,
    query: IPaginationQuery,
    filter?: FilterDebtDto,
  ): Promise<IPaginationResult<DebtResponseDto>> {
    const { page, limit, skip, take } =
      this.databaseService.createPaginationOptions(query);

    const where: Record<string, unknown> = { userId };

    if (filter?.direction) {
      where.direction = filter.direction;
    }

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.currencyId) {
      where.currencyId = filter.currencyId;
    }

    if (filter?.startDate && filter?.endDate) {
      where.dueDate = Between(filter.startDate, filter.endDate);
    }

    const [rows, total] = await this.debtRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      data: rows.map(toDebtResponse),
      meta: this.databaseService.createPaginationMetaData(limit, page, total),
    };
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateDebtDto,
  ): Promise<DebtResponseDto> {
    const debt = await this.debtRepo.findOne({ where: { id, userId } });
    if (!debt) throw new NotFoundException('Debt not found');

    if (dto.personalName !== undefined) {
      debt.personalName = dto.personalName;
    }

    if (dto.amount !== undefined) {
      debt.amount = dto.amount;
    }

    if (dto.dueDate !== undefined) {
      debt.dueDate = dto.dueDate;
    }

    if (dto.description !== undefined) {
      debt.description = dto.description ?? null;
    }

    if (dto.status !== undefined) {
      debt.status = dto.status;
    }

    if (dto.reminderEnabled !== undefined) {
      debt.reminderEnabled = dto.reminderEnabled;
    }

    if (dto.remindAt !== undefined) {
      debt.remindAt = dto.remindAt ?? null;
    }

    if (debt.reminderEnabled && !debt.remindAt) {
      throw new BadRequestException(
        'Reminder date is required when reminder is enabled',
      );
    }

    if (dto.assetId !== undefined) {
      debt.assetId = dto.assetId ?? null;
    }

    const saved = await this.debtRepo.save(debt);
    return toDebtResponse(saved);
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<{ data: null; message: string }> {
    const exists = await this.debtRepo.exists({ where: { id, userId } });
    if (!exists) throw new NotFoundException('Debt not found');

    await this.debtRepo.delete({ id });
    return { data: null, message: 'Debt deleted successfully' };
  }

  // Get debt summary
  async getDebtSummary(userId: string): Promise<{
    totalOwed: string;
    totalOwe: string;
    netBalance: string;
    unpaidCount: number;
  }> {
    const debts = await this.debtRepo.find({ where: { userId } });

    const totalOwed = debts
      .filter((d) => d.direction === DebtDirection.OWED_TO_ME)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const totalOwe = debts
      .filter((d) => d.direction === DebtDirection.I_OWE)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const unpaidCount = debts.filter(
      (d) => d.status === DebtStatus.UNPAID,
    ).length;

    return {
      totalOwed: totalOwed.toFixed(2),
      totalOwe: totalOwe.toFixed(2),
      netBalance: (totalOwed - totalOwe).toFixed(2),
      unpaidCount,
    };
  }
}
