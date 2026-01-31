import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Debt } from '../../../database/entities/debts.entities';
import { Currency } from '../../../database/entities/currency.entities';
import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Debt, Currency]), DatabaseModule],
  controllers: [DebtController],
  providers: [DebtService],
  exports: [DebtService],
})
export class DebtModule {}
