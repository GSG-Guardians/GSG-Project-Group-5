import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../../../database/entities/bills.entities';
import { GroupInvoice } from '../../../database/entities/group-invoice.entities';
import { BillStatus, GroupInvoiceStatus } from '../../../database/enums';
import { type TCreateBillRequest, type TUpdateBillRequest } from './dto';

export type BillType = 'individual' | 'group';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(GroupInvoice)
    private readonly groupInvoiceRepository: Repository<GroupInvoice>,
  ) {}

  async listBills(params: { type?: BillType; page: number; limit: number }) {
    const { type, page, limit } = params;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    if (type === 'individual') {
      const [items, total] = await this.billRepository.findAndCount({
        order: { dueDate: 'DESC' },
        skip,
        take: safeLimit,
      });

      return {
        items: items.map((bill) => this.mapIndividualBillSummary(bill)),
        meta: {
          page: safePage,
          limit: safeLimit,
          total,
        },
      };
    }

    if (type === 'group') {
      const [items, total] = await this.groupInvoiceRepository.findAndCount({
        order: { dueDate: 'DESC' },
        skip,
        take: safeLimit,
      });

      return {
        items: items.map((invoice) => this.mapGroupBillSummary(invoice)),
        meta: {
          page: safePage,
          limit: safeLimit,
          total,
        },
      };
    }

    const takeForMerge = safePage * safeLimit;
    const [individual, group] = await Promise.all([
      this.billRepository.find({
        order: { dueDate: 'DESC' },
        take: takeForMerge,
      }),
      this.groupInvoiceRepository.find({
        order: { dueDate: 'DESC' },
        take: takeForMerge,
      }),
    ]);

    const merged = [
      ...individual.map((bill) => this.mapIndividualBillSummary(bill)),
      ...group.map((invoice) => this.mapGroupBillSummary(invoice)),
    ].sort((a, b) => (a.date < b.date ? 1 : -1));

    const items = merged.slice(skip, skip + safeLimit);
    return {
      items,
      meta: {
        page: safePage,
        limit: safeLimit,
        total: merged.length,
        totals: {
          individual: individual.length,
          group: group.length,
        },
      },
    };
  }

  async getBillDetails(id: string) {
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['currency', 'asset', 'reminder'],
    });

    if (bill) {
      return {
        type: 'individual',
        ...bill,
        status: this.mapBillStatus(bill.status),
      };
    }

    const groupInvoice = await this.groupInvoiceRepository.findOne({
      where: { id },
      relations: [
        'currency',
        'asset',
        'reminder',
        'shares',
        'shares.user',
        'shares.items',
      ],
    });

    if (!groupInvoice) {
      throw new NotFoundException('Bill not found');
    }

    return {
      type: 'group',
      ...groupInvoice,
      status: this.mapGroupStatus(groupInvoice.status),
      participants: (groupInvoice.shares ?? []).map((share) => ({
        id: share.id,
        userId: share.userId,
        user: share.user,
        amountShare: share.amountShare,
        percentage: share.percentage,
        paidAt: share.paidAt,
        items: share.items,
      })),
    };
  }

  async createBill(userId: string, dto: TCreateBillRequest) {
    if (!dto.type) {
      throw new BadRequestException('type is required');
    }

    if (dto.type === 'individual') {
      if (!dto.currencyId) {
        throw new BadRequestException('currencyId is required');
      }

      const bill = this.billRepository.create({
        userId,
        name: dto.name,
        amount: dto.amount.toString(),
        dueDate: dto.date,
        currencyId: dto.currencyId,
        description: dto.description ?? null,
        assetId: dto.assetId ?? null,
        status: BillStatus.UNPAID,
      });

      const saved = await this.billRepository.save(bill);
      return {
        type: 'individual',
        ...saved,
        status: this.mapBillStatus(saved.status),
      };
    }

    if (!dto.currencyId) {
      throw new BadRequestException('currencyId is required');
    }

    const groupInvoice = this.groupInvoiceRepository.create({
      createdByUserId: userId,
      title: dto.name,
      amountTotal: dto.amount.toString(),
      dueDate: dto.date,
      currencyId: dto.currencyId,
      description: dto.description ?? null,
      status: GroupInvoiceStatus.UNPAID,
    });

    const saved = await this.groupInvoiceRepository.save(groupInvoice);
    return {
      type: 'group',
      ...saved,
      status: this.mapGroupStatus(saved.status),
    };
  }

  async updateBill(id: string, dto: TUpdateBillRequest) {
    const bill = await this.billRepository.findOne({ where: { id } });
    if (bill) {
      if (dto.name !== undefined) bill.name = dto.name;
      if (dto.amount !== undefined) bill.amount = dto.amount.toString();
      if (dto.date !== undefined) bill.dueDate = dto.date;
      if (dto.currencyId !== undefined) bill.currencyId = dto.currencyId;
      if (dto.description !== undefined) bill.description = dto.description;
      if (dto.assetId !== undefined) bill.assetId = dto.assetId;

      const saved = await this.billRepository.save(bill);
      return {
        type: 'individual',
        ...saved,
        status: this.mapBillStatus(saved.status),
      };
    }

    const groupInvoice = await this.groupInvoiceRepository.findOne({
      where: { id },
    });
    if (!groupInvoice) {
      throw new NotFoundException('Bill not found');
    }

    if (dto.name !== undefined) groupInvoice.title = dto.name;
    if (dto.amount !== undefined) {
      groupInvoice.amountTotal = dto.amount.toString();
    }
    if (dto.date !== undefined) groupInvoice.dueDate = dto.date;
    if (dto.currencyId !== undefined) groupInvoice.currencyId = dto.currencyId;
    if (dto.description !== undefined) {
      groupInvoice.description = dto.description;
    }
    if (dto.assetId !== undefined) groupInvoice.assetId = dto.assetId;

    const saved = await this.groupInvoiceRepository.save(groupInvoice);
    return {
      type: 'group',
      ...saved,
      status: this.mapGroupStatus(saved.status),
    };
  }

  async deleteBill(id: string) {
    const bill = await this.billRepository.findOne({ where: { id } });
    if (bill) {
      await this.billRepository.remove(bill);
      return { deleted: true };
    }

    const groupInvoice = await this.groupInvoiceRepository.findOne({
      where: { id },
    });
    if (!groupInvoice) {
      throw new NotFoundException('Bill not found');
    }

    await this.groupInvoiceRepository.remove(groupInvoice);
    return { deleted: true };
  }

  async updateBillStatus(id: string, status: 'paid' | 'unpaid') {
    const normalized = status.toLowerCase();
    const isPaid = normalized === 'paid';
    const bill = await this.billRepository.findOne({ where: { id } });
    if (bill) {
      bill.status = isPaid ? BillStatus.PAID : BillStatus.UNPAID;
      bill.paidAt = isPaid ? new Date() : null;
      const saved = await this.billRepository.save(bill);
      return {
        type: 'individual',
        ...saved,
        status: this.mapBillStatus(saved.status),
      };
    }

    const groupInvoice = await this.groupInvoiceRepository.findOne({
      where: { id },
    });
    if (!groupInvoice) {
      throw new NotFoundException('Bill not found');
    }

    groupInvoice.status = isPaid
      ? GroupInvoiceStatus.PAID
      : GroupInvoiceStatus.UNPAID;

    const saved = await this.groupInvoiceRepository.save(groupInvoice);
    return {
      type: 'group',
      ...saved,
      status: this.mapGroupStatus(saved.status),
    };
  }

  private mapBillStatus(status: BillStatus) {
    return status === BillStatus.PAID ? 'paid' : 'unpaid';
  }

  private mapGroupStatus(status: GroupInvoiceStatus) {
    return status === GroupInvoiceStatus.PAID ? 'paid' : 'unpaid';
  }

  private mapIndividualBillSummary(bill: Bill) {
    return {
      id: bill.id,
      name: bill.name,
      amount: bill.amount,
      date: bill.dueDate,
      status: this.mapBillStatus(bill.status),
      type: 'individual',
      currencyId: bill.currencyId,
    };
  }

  private mapGroupBillSummary(invoice: GroupInvoice) {
    return {
      id: invoice.id,
      name: invoice.title,
      amount: invoice.amountTotal,
      date: invoice.dueDate,
      status: this.mapGroupStatus(invoice.status),
      type: 'group',
      currencyId: invoice.currencyId,
    };
  }
}
