import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import type { HashingProviderInterface } from 'src/auth/interfaces/hashing.provider.interface';
import { AdminRequestDto } from 'src/Dtos/user/admin.request.dto';
import { UserE } from 'src/entities/user.entity';
import { UserRoleFilterDto } from 'src/Dtos/user/user-role.filter.dto';
import { RolesEnum } from 'src/enums/roles.enum';
import { UserRequestDto } from 'src/Dtos/user/user.request.dto';
import { SearchUserDto } from 'src/Dtos/user/search-user.dto';
import { UpdateUserDto } from 'src/Dtos/user/user.update.dto';

type CanBeUpdated = {
  role: RolesEnum;
};

export type UniqueFields = {
  id: string;
  national_id: string;
  phone_number: string;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserE)
    private readonly userRepo: Repository<UserE>,
    @Inject(forwardRef(() => 'HashingProvider'))
    private readonly hashingProvider: HashingProviderInterface,
  ) {}

  async createUser(
    userRequestDto: UserRequestDto | AdminRequestDto,
  ): Promise<UserE> {
    const role =
      userRequestDto instanceof AdminRequestDto
        ? [RolesEnum.ADMIN]
        : [RolesEnum.USER];

    const existingUser = await this.userRepo.findOne({
      where: [
        { national_id: userRequestDto.national_id },
        { phone_number: userRequestDto.phone_number },
        { whatsApp_number: userRequestDto.whatsApp_number },
        { job_number: userRequestDto.job_number },
        { BANK_IBAN: userRequestDto.BANK_IBAN },
      ],
    });
    if (existingUser) {
      if (existingUser.national_id === userRequestDto.national_id) {
        throw new BadRequestException('national_id already exists');
      }
      if (existingUser.phone_number === userRequestDto.phone_number) {
        throw new BadRequestException('phone number already used');
      }
      if (existingUser.whatsApp_number === userRequestDto.whatsApp_number) {
        throw new BadRequestException('WhatsApp number already used');
      }
      if (existingUser.BANK_IBAN === userRequestDto.BANK_IBAN) {
        throw new BadRequestException('Bank IBAN already used');
      }
      if (existingUser.job_number === userRequestDto.job_number) {
        throw new BadRequestException('Job number already used');
      }
    }

    const encryptedPassword = await this.hashingProvider.hash(
      userRequestDto.password,
    );

    let UserEntity = await this.userRepo.create({
      ...userRequestDto,
      password: encryptedPassword,
      roles: role,
    });

    try {
      UserEntity = await this.userRepo.save(UserEntity);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unaple to process your request at the moment. please try again leter',
        {
          description: 'Error connicting to the database',
        },
      );
    }

    return UserEntity;
  }

  async findOneBynationalID(national_id: string): Promise<UserE | null> {
    const user = await this.userRepo.findOneBy({ national_id: national_id });
    return user ?? null;
  }

  async findOne(id: string): Promise<UserE | null> {
    const user = await this.userRepo.findOne({
      where: { id: id },
    });
    return user ?? null;
  }

  async findAll(userRoleFilterDto: UserRoleFilterDto): Promise<UserE[]> {
    let where = {};
    if (userRoleFilterDto.role) {
      where['roles'] = ArrayContains([userRoleFilterDto.role]);
    }
    return this.userRepo.find({
      where,
      order: { createdAt: 'DESC' }, // اختياري
    });
  }

  async assignRole(
    uniqueFields: Partial<UniqueFields>,
    role: RolesEnum,
  ): Promise<UserE | null> {
    const { whereParts } = this.buildUniqueParams(uniqueFields);

    // ابحث أولًا (بديل findOneAndUpdate)
    const user = await this.userRepo.findOne(whereParts);
    if (!user) return null;

    user.roles.push(role as any);

    const updated = await this.userRepo.save(user);
    return updated ?? null;
  }

  private buildUniqueParams(uniqueFields: Partial<UniqueFields>) {
    const whereParts = {};

    if (uniqueFields) {
      if (uniqueFields.id) {
        whereParts['id'] = uniqueFields.id;
      }
      if (uniqueFields.national_id) {
        whereParts['national_id'] = uniqueFields.national_id;
      }
      if (uniqueFields.phone_number) {
        whereParts['phone_number'] = uniqueFields.phone_number;
      }
    }
    return { whereParts };
  }

  async searchByName(searchUserDto: SearchUserDto): Promise<UserE[]> {
    const { searchTerm } = searchUserDto;

    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    return await this.userRepo
      .createQueryBuilder('user')
      .where('user.first_name ILIKE :term', { term: `%${searchTerm}%` })
      .orWhere('user.last_name ILIKE :term', { term: `%${searchTerm}%` })
      .take(50)
      .getMany();
  }

  async terminateUser(id: string): Promise<UserE | null> {
    const user = await this.userRepo.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const termenateRequest = await this.terminationRequestService.findByUserId(
    //   user.id,
    // );
    // if (!termenateRequest) {
    //   throw new BadRequestException(
    //     'No termination request found for this User',
    //   );
    // }
    // if (termenateRequest.status !== TerminationStatusEnum.APPROVED) {
    //   throw new BadRequestException(
    //     `Termination request is ${termenateRequest.status} for this User`,
    //   );
    // }

    // Soft delete the user
    await this.userRepo.softDelete(id);

    // Return the user with deletedAt timestamp
    const terminatedUser = await this.userRepo.findOne({
      where: { id: id },
      withDeleted: true, // This allows us to fetch soft-deleted records
    });

    return terminatedUser;
  }

  async updateUser(
    guardId: string,
    updateGuardDto: UpdateUserDto,
  ): Promise<UserE> {
    const guard = await this.userRepo.findOne({
      where: { id: guardId },
    });

    if (!guard) {
      throw new NotFoundException('User not found');
    }

    // Track if any changes are being made
    let hasChanges = false;

    // Check for unique constraints if fields are being updated
    if (
      updateGuardDto.national_id ||
      updateGuardDto.phone_number ||
      updateGuardDto.whatsApp_number ||
      updateGuardDto.job_number ||
      updateGuardDto.BANK_IBAN
    ) {
      const existingUser = await this.userRepo.findOne({
        where: [
          updateGuardDto.national_id
            ? { national_id: updateGuardDto.national_id }
            : {},
          updateGuardDto.phone_number
            ? { phone_number: updateGuardDto.phone_number }
            : {},
          updateGuardDto.whatsApp_number
            ? { whatsApp_number: updateGuardDto.whatsApp_number }
            : {},
          updateGuardDto.job_number
            ? { job_number: updateGuardDto.job_number }
            : {},
          updateGuardDto.BANK_IBAN
            ? { BANK_IBAN: updateGuardDto.BANK_IBAN }
            : {},
        ].filter((obj) => Object.keys(obj).length > 0),
      });

      // If found and it's not the same guard, throw conflict
      if (existingUser && existingUser.id !== guardId) {
        if (
          updateGuardDto.national_id &&
          existingUser.national_id === updateGuardDto.national_id
        ) {
          throw new ConflictException('National ID already exists');
        }
        if (
          updateGuardDto.phone_number &&
          existingUser.phone_number === updateGuardDto.phone_number
        ) {
          throw new ConflictException('Phone number already used');
        }
        if (
          updateGuardDto.whatsApp_number &&
          existingUser.whatsApp_number === updateGuardDto.whatsApp_number
        ) {
          throw new ConflictException('WhatsApp number already used');
        }
        if (
          updateGuardDto.BANK_IBAN &&
          existingUser.BANK_IBAN === updateGuardDto.BANK_IBAN
        ) {
          throw new ConflictException('Bank IBAN already used');
        }
        if (
          updateGuardDto.job_number &&
          existingUser.job_number === updateGuardDto.job_number
        ) {
          throw new ConflictException('Job number already used');
        }
      }
    }

    // Update only the provided fields that are different (idempotent)
    if (
      updateGuardDto.national_id !== undefined &&
      guard.national_id !== updateGuardDto.national_id
    ) {
      guard.national_id = updateGuardDto.national_id;
      hasChanges = true;
    }
    if (
      updateGuardDto.first_name !== undefined &&
      guard.first_name !== updateGuardDto.first_name
    ) {
      guard.first_name = updateGuardDto.first_name;
      hasChanges = true;
    }
    if (
      updateGuardDto.last_name !== undefined &&
      guard.last_name !== updateGuardDto.last_name
    ) {
      guard.last_name = updateGuardDto.last_name;
      hasChanges = true;
    }
    if (
      updateGuardDto.phone_number !== undefined &&
      guard.phone_number !== updateGuardDto.phone_number
    ) {
      guard.phone_number = updateGuardDto.phone_number;
      hasChanges = true;
    }
    if (
      updateGuardDto.whatsApp_number !== undefined &&
      guard.whatsApp_number !== updateGuardDto.whatsApp_number
    ) {
      guard.whatsApp_number = updateGuardDto.whatsApp_number;
      hasChanges = true;
    }
    if (
      updateGuardDto.job_number !== undefined &&
      guard.job_number !== updateGuardDto.job_number
    ) {
      guard.job_number = updateGuardDto.job_number;
      hasChanges = true;
    }
    if (
      updateGuardDto.BANK_IBAN !== undefined &&
      guard.BANK_IBAN !== updateGuardDto.BANK_IBAN
    ) {
      guard.BANK_IBAN = updateGuardDto.BANK_IBAN;
      hasChanges = true;
    }
    if (
      updateGuardDto.address !== undefined &&
      guard.address !== updateGuardDto.address
    ) {
      guard.address = updateGuardDto.address;
      hasChanges = true;
    }
    if (updateGuardDto.birthday !== undefined) {
      const newBirthday = new Date(updateGuardDto.birthday);
      const existingBirthday = guard.birthday ? new Date(guard.birthday) : null;

      // Compare dates (ignore time)
      if (
        !existingBirthday ||
        newBirthday.toDateString() !== existingBirthday.toDateString()
      ) {
        guard.birthday = newBirthday;
        hasChanges = true;
      }
    }

    // Idempotent: If no changes, return the guard without saving
    if (!hasChanges) {
      return guard;
    }

    try {
      return await this.userRepo.save(guard);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }
}
