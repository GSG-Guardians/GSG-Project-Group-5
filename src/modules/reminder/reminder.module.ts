import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '../../../database/entities/bills.entities';
import { Debt } from '../../../database/entities/debts.entities';
import { Reminder } from '../../../database/entities/reminders.entities';
import { ReminderService } from './reminder.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, Debt, Reminder]),
    NotificationModule,
  ],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
