import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../../../database/entities/user.entities';
import { Currency } from '../../../database/entities/currency.entities';

import { CreateUserDto, UpdateUserDto } from './dto/request.dto';
import { UserResponseDto } from './dto/response.dto';
import { IPaginationQuery, IPaginationResult } from '../../types/pagination.types';

import { toUserResponse } from './mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) { }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const email = dto.email.toLowerCase();

    // unique email
    const emailExists = await this.userRepo.findOne({ where: { email } });
    if (emailExists) throw new ConflictException('Email already exists');

    // validate currency if provided (your column is nullable)
    if (dto.defaultCurrencyId) {
      const currency = await this.currencyRepo.findOne({
        where: { id: dto.defaultCurrencyId },
      });
      if (!currency) throw new BadRequestException('Invalid defaultCurrencyId');
    }

    const provider = dto.provider ?? 'LOCAL';

    // hash password for LOCAL
    const passwordHash =
      provider === 'LOCAL' && dto.password
        ? await bcrypt.hash(dto.password, 10)
        : null;

    const user = this.userRepo.create({
      fullName: dto.fullName,
      email,
      phone: dto.phone ?? null,
      passwordHash,
      provider,
      providerId: dto.providerId ?? null,
      defaultCurrencyId: dto.defaultCurrencyId ?? null,
      role: dto.role ?? undefined,
      status: dto.status ?? undefined,
    })

    const saved = await this.userRepo.save(user);
    return toUserResponse(saved);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return toUserResponse(user);
  }

  async findAll(
    query: IPaginationQuery,
  ): Promise<IPaginationResult<UserResponseDto>> {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    const [rows, total] = await this.userRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: rows.map(toUserResponse),
      meta: { total, page, limit, totalPages },
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

    // phone change 
    if (dto.phone !== undefined) {
      if (dto.phone) {
        const phoneExists = await this.userRepo.findOne({
          where: { phone: dto.phone },
        });
      }
      user.phone = dto.phone ?? null;
    }

    // currency change + validation
    if (dto.defaultCurrencyId !== undefined) {
      if (dto.defaultCurrencyId) {
        const currency = await this.currencyRepo.findOne({
          where: { id: dto.defaultCurrencyId },
        });
        if (!currency) throw new BadRequestException('Invalid defaultCurrencyId');
      }
      user.defaultCurrencyId = dto.defaultCurrencyId ?? null;
    }

    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.avatarAssetId !== undefined)
      user.avatarAssetId = dto.avatarAssetId ?? null;

    if (dto.provider !== undefined) user.provider = dto.provider;
    if (dto.providerId !== undefined) user.providerId = dto.providerId ?? null;

    // admin fields (protect with guards later)
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.status !== undefined) user.status = dto.status;

    const saved = await this.userRepo.save(user);
    return toUserResponse(saved);
  }

  async remove(id: string): Promise<{ data: null; message: string }> {
    const exists = await this.userRepo.exist({ where: { id } });
    if (!exists) throw new NotFoundException('User not found');

    await this.userRepo.delete({ id });
    return { data: null, message: 'User deleted' };
  }
}