import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { User } from '../../../database/entities/user.entities';
import { Currency } from '../../../database/entities/currency.entities';
import { DatabaseService } from '../database/database.service';

import { CreateUserDto, UpdateUserDto } from './dto/request.dto';
import { UserResponseDto } from './dto/response.dto';
import {
  IPaginationQuery,
  IPaginationResult,
} from '../../types/pagination.types';

import { toUserResponse } from './mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const email = dto.email.toLowerCase();

    const emailExists = await this.userRepo.findOne({ where: { email } });
    if (emailExists) throw new ConflictException('Email already exists');

    let currencyId = dto.defaultCurrencyId;

    if (currencyId) {
      const currency = await this.currencyRepo.findOne({
        where: { id: currencyId },
      });
      if (!currency) throw new BadRequestException('Invalid defaultCurrencyId');
    } else {
      const usdCurrency = await this.currencyRepo.findOne({
        where: { code: 'USD' },
      });
      if (!usdCurrency) {
        throw new BadRequestException('Default currency USD not found');
      }
      currencyId = usdCurrency.id;
    }

    const provider = dto.provider ?? 'LOCAL';

    const passwordHash =
      provider === 'LOCAL' && dto.password ? dto.password : null;

    const user = this.userRepo.create({
      fullName: dto.fullName,
      email,
      phone: dto.phone ?? null,
      passwordHash,
      provider,
      providerId: dto.providerId ?? null,
      defaultCurrencyId: currencyId,
      role: dto.role ?? undefined,
      status: dto.status ?? undefined,
    });

    const saved = await this.userRepo.save(user);
    return toUserResponse(saved);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return toUserResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findAll(
    query: IPaginationQuery,
  ): Promise<IPaginationResult<UserResponseDto>> {
    const { page, limit, skip, take } =
      this.databaseService.createPaginationOptions(query);

    const [rows, total] = await this.userRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      data: rows.map(toUserResponse),
      meta: this.databaseService.createPaginationMetaData(limit, page, total),
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // email change + unique
    if (dto.email !== undefined) {
      const nextEmail = dto.email.toLowerCase();
      if (nextEmail !== user.email) {
        const emailExists = await this.userRepo.findOne({
          where: { email: nextEmail },
        });
        if (emailExists) throw new ConflictException('Email already exists');
        user.email = nextEmail;
      }
    }

    if (dto.phone !== undefined) {
      user.phone = dto.phone ?? null;
    }
    if (dto.defaultCurrencyId !== undefined) {
      if (dto.defaultCurrencyId) {
        const currency = await this.currencyRepo.findOne({
          where: { id: dto.defaultCurrencyId },
        });
        if (!currency)
          throw new BadRequestException('Invalid defaultCurrencyId');
      }
      user.defaultCurrencyId = dto.defaultCurrencyId ?? null;
    }

    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.avatarAssetId !== undefined)
      user.avatarAssetId = dto.avatarAssetId ?? null;
    const saved = await this.userRepo.save(user);
    return toUserResponse(saved);
  }

  async remove(id: string): Promise<{ data: null; message: string }> {
    const exists = await this.userRepo.exists({ where: { id } });
    if (!exists) throw new NotFoundException('User not found');

    await this.userRepo.delete({ id });
    return { data: null, message: 'User deleted' };
  }

  async searchUsers(name: string) {
    if (!name || name.trim().length === 0) {
      return [];
    }

    const users = await this.userRepo.find({
      where: [{ fullName: Like(`%${name}%`) }, { email: Like(`%${name}%`) }],
      select: ['id', 'fullName', 'email'],
      take: 20,
    });

    return users;
  }
}
