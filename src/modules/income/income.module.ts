import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from '../../../database/entities/income.entities';
import { Currency } from '../../../database/entities/currency.entities';
import { IncomeRecurringRule } from '../../../database/entities/income-recurring-rule.entities';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { IncomeRecurringCronService } from './income-recurring-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Income, Currency, IncomeRecurringRule]),
    DatabaseModule,
    UserModule,
  ],
  controllers: [IncomeController],
  providers: [IncomeService, IncomeRecurringCronService],
  exports: [IncomeService],
})
export class IncomeModule {}
