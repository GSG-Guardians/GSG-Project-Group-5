import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../../../database/entities/currency.entities';
import { FinancialInsight } from '../../../database/entities/financial-insight.entities';
import { ExpensesModule } from '../expenses/expenses.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Currency, FinancialInsight]),
    ExpensesModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
