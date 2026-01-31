import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { Budget } from '../../../database/entities/budget.entities';
import { DatabaseService } from '../database/database.service';

import {
  CreateBudgetDto,
  UpdateBudgetDto,
  FilterBudgetDto,
} from './dto/request.dto';
import { BudgetResponseDto } from './dto/response.dto';
import {
  IPaginationQuery,
  IPaginationResult,
} from '../../types/pagination.types';

import { toBudgetResponse } from './mappers/budget.mapper';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget) private readonly budgetRepo: Repository<Budget>,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(
    userId: string,
    dto: CreateBudgetDto,
  ): Promise<BudgetResponseDto> {
    if (dto.endDate <= dto.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const budget = this.budgetRepo.create({
      user_id: userId,
      category: dto.category,
      allocated_amount: parseFloat(dto.allocatedAmount),
      spent_amount: 0,
      start_date: dto.startDate,
      end_date: dto.endDate,
      notes: dto.notes ?? null,
      is_active: true,
    });

    const saved = await this.budgetRepo.save(budget);
    return toBudgetResponse(saved);
  }

  async findOne(id: string, userId: string): Promise<BudgetResponseDto> {
    const budget = await this.budgetRepo.findOne({
      where: { id, user_id: userId, is_active: true },
    });
    if (!budget) throw new NotFoundException('Budget not found');
    return toBudgetResponse(budget);
  }

  async findAll(
    userId: string,
    query: IPaginationQuery,
    filter?: FilterBudgetDto,
  ): Promise<IPaginationResult<BudgetResponseDto>> {
    const { page, limit, skip, take } =
      this.databaseService.createPaginationOptions(query);

    const where: any = { user_id: userId, is_active: true };

    if (filter?.category) {
      where.category = filter.category;
    }

    if (filter?.startDate && filter?.endDate) {
      where.start_date = Between(filter.startDate, filter.endDate);
    } else if (filter?.startDate) {
      where.start_date = MoreThanOrEqual(filter.startDate);
    } else if (filter?.endDate) {
      where.end_date = LessThanOrEqual(filter.endDate);
    }

    const [rows, total] = await this.budgetRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      data: rows.map(toBudgetResponse),
      meta: this.databaseService.createPaginationMetaData(limit, page, total),
    };
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateBudgetDto,
  ): Promise<BudgetResponseDto> {
    const budget = await this.budgetRepo.findOne({
      where: { id, user_id: userId, is_active: true },
    });
    if (!budget) throw new NotFoundException('Budget not found');

    if (dto.allocatedAmount !== undefined) {
      budget.allocated_amount = parseFloat(dto.allocatedAmount);
    }

    if (dto.startDate !== undefined) {
      budget.start_date = dto.startDate;
    }

    if (dto.endDate !== undefined) {
      budget.end_date = dto.endDate;
    }

    if (dto.startDate || dto.endDate) {
      if (budget.end_date <= budget.start_date) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    if (dto.notes !== undefined) {
      budget.notes = dto.notes ?? null;
    }

    const saved = await this.budgetRepo.save(budget);
    return toBudgetResponse(saved);
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<{ data: null; message: string }> {
    const budget = await this.budgetRepo.findOne({
      where: { id, user_id: userId, is_active: true },
    });
    if (!budget) throw new NotFoundException('Budget not found');

    budget.is_active = false;
    await this.budgetRepo.save(budget);

    return { data: null, message: 'Budget deleted successfully' };
  }

  // Additional methods for budget analytics
  async getBudgetSummary(userId: string): Promise<{
    totalAllocated: number;
    totalSpent: number;
    totalRemaining: number;
    utilizationPercentage: number;
  }> {
    const budgets = await this.budgetRepo.find({
      where: { user_id: userId, is_active: true },
    });

    const totalAllocated = budgets.reduce(
      (sum, b) => sum + Number(b.allocated_amount),
      0,
    );
    const totalSpent = budgets.reduce(
      (sum, b) => sum + Number(b.spent_amount),
      0,
    );
    const totalRemaining = totalAllocated - totalSpent;
    const utilizationPercentage =
      totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    return {
      totalAllocated,
      totalSpent,
      totalRemaining,
      utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
    };
  }
}
