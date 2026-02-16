import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';

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
import { AssetOwnerType, UserRole, UserStatus } from 'database/enums';
import { SideEffectQueue } from 'src/utils/side-effetcts';
import { AssetsService } from '../assets/assets.service';
import { Asset } from 'database/entities/assets.entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
    private readonly databaseService: DatabaseService,
    private readonly dataSource: DataSource,
    private readonly assetsService: AssetsService,
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
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
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

  async update(id: string, dto: UpdateUserDto, file?: Express.Multer.File): Promise<UserResponseDto> {
    const sideEffect = new SideEffectQueue();
    const updatedUser = await this.dataSource.transaction(async (tx) => {
      if(file) {
        await this.assetsService.deleteAsset(
          tx, 
          id, 
          sideEffect, 
          AssetOwnerType.USER, 
          id
        );

        const assetData = this.assetsService.createFileAssetData(
          file,
          id,
          AssetOwnerType.USER,
          id,
        );
        const asset = tx.create(Asset, assetData);
        await tx.save(asset);
      }

      const res = await tx.update(User, { id }, {...dto});
      if(res.affected === 0) throw new BadRequestException('User not updated');
      
      const updatedUser = await tx.findOne(User, {
        where: { id },
        relations: { assets: true },
      });
      
      if (!updatedUser ) throw new BadRequestException('User not found after update');
      
    return toUserResponse(updatedUser) ;
    })

    await sideEffect.runAll();
    return updatedUser;
  }

  async remove(id: string): Promise<{ data: null; message: string }> {
    const sideEffect = new SideEffectQueue();

    await this.dataSource.transaction(async (tx) => {

      const user = await tx.findOne(User, { where: { id } });
      if (!user) throw new NotFoundException('User not found');

      await this.assetsService.deleteAsset(
        tx,
        id,
        sideEffect,
        AssetOwnerType.USER,
        id,
      );

      await tx.delete(User, { id });
    });

    await sideEffect.runAll();

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
