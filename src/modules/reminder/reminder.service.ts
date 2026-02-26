import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from 'database/entities/bills.entities';
import { Debt } from 'database/entities/debts.entities';
import { Reminder } from 'database/entities/reminders.entities';
import {
  BillStatus,
  DebtStatus,
  NotificationType,
  ReminderFrequency,
} from 'database/enums';
import { Repository } from 'typeorm';
import {
  IPaginationQuery,
  IPaginationResult,
} from '../../types/pagination.types';
import { DatabaseService } from '../database/database.service';
import { ReminderResponseDto } from './dto/response.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
    private readonly notificationService: NotificationService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async create24HourBillReminders(): Promise<void> {
    const targetDate = this.getTargetDateISO();

    const bills = await this.billRepository.find({
      where: {
        status: BillStatus.UNPAID,
        dueDate: targetDate,
      },
      relations: ['reminder'],
    });

    const dueAt = this.getDueAtDate(targetDate);
    const pendingBills = bills.filter((bill) => !bill.reminder);
    const remindersToCreate = pendingBills.map((bill) =>
      this.reminderRepository.create({
        userId: bill.userId,
        billId: bill.id,
        dueDate: bill.dueDate,
        description: `Bill "${bill.name}" is due in 24 hours`,
        isActive: true,
        frequency: ReminderFrequency.NONE,
        nextRemindAt: dueAt,
        lastSentAt: null,
        completedAt: null,
      }),
    );

    if (remindersToCreate.length === 0) {
      return;
    }

    await this.reminderRepository.save(remindersToCreate);
    await Promise.all(
      pendingBills.map((bill) =>
        this.notificationService.create({
          userId: bill.userId,
          type: NotificationType.BILL_REMINDER,
          title: 'Bill Reminder',
          body: `Bill "${bill.name}" is due in 24 hours`,
          entityType: 'BILL',
          entityId: bill.id,
          data: {
            dueDate: bill.dueDate,
            amount: bill.amount,
            currencyId: bill.currencyId,
          },
        }),
      ),
    );
    this.logger.log(
      `Created ${remindersToCreate.length} bill reminder(s) for due date ${targetDate}`,
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async create24HourDebtReminders(): Promise<void> {
    const targetDate = this.getTargetDateISO();

    const debts = await this.debtRepository.find({
      where: {
        status: DebtStatus.UNPAID,
        reminderEnabled: true,
        dueDate: targetDate,
      },
      relations: ['reminder'],
    });

    const dueAt = this.getDueAtDate(targetDate);
    const pendingDebts = debts.filter((debt) => !debt.reminder);
    const remindersToCreate = pendingDebts.map((debt) =>
      this.reminderRepository.create({
        userId: debt.userId,
        debtId: debt.id,
        dueDate: debt.dueDate,
        description: `Debt with "${debt.personalName}" is due in 24 hours`,
        isActive: true,
        frequency: ReminderFrequency.NONE,
        nextRemindAt: dueAt,
        lastSentAt: null,
        completedAt: null,
      }),
    );

    if (remindersToCreate.length === 0) {
      return;
    }

    await this.reminderRepository.save(remindersToCreate);
    await Promise.all(
      pendingDebts.map((debt) =>
        this.notificationService.create({
          userId: debt.userId,
          type: NotificationType.DEBT_REMINDER,
          title: 'Debt Reminder',
          body: `Debt with "${debt.personalName}" is due in 24 hours`,
          entityType: 'DEBT',
          entityId: debt.id,
          data: {
            dueDate: debt.dueDate,
            amount: debt.amount,
            direction: debt.direction,
          },
        }),
      ),
    );
    this.logger.log(
      `Created ${remindersToCreate.length} debt reminder(s) for due date ${targetDate}`,
    );
  }

  private getTargetDateISO(): string {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    now.setUTCDate(now.getUTCDate() + 1);
    return now.toISOString().slice(0, 10);
  }

  private getDueAtDate(dateISO: string): Date {
    return new Date(`${dateISO}T00:00:00.000Z`);
  }

  async findMyReminders(
    userId: string,
    query: IPaginationQuery,
  ): Promise<IPaginationResult<ReminderResponseDto>> {
    const { page, limit, skip, take } =
      this.databaseService.createPaginationOptions(query);

    const [rows, total] = await this.reminderRepository.findAndCount({
      where: { userId },
      order: { dueDate: 'ASC', createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      data: rows.map((row) => this.toReminderResponse(row)),
      meta: this.databaseService.createPaginationMetaData(limit, page, total),
    };
  }

  private toReminderResponse(reminder: Reminder): ReminderResponseDto {
    return {
      id: reminder.id,
      userId: reminder.userId,
      dueDate: reminder.dueDate,
      description: reminder.description,
      isActive: reminder.isActive,
      frequency: reminder.frequency,
      nextRemindAt: reminder.nextRemindAt,
      lastSentAt: reminder.lastSentAt,
      completedAt: reminder.completedAt,
      debtId: reminder.debtId,
      billId: reminder.billId,
      expenseId: reminder.expenseId,
      groupInvoiceId: reminder.groupInvoiceId,
      createdAt: reminder.createdAt,
      updatedAt: reminder.updatedAt,
    };
  }
}
