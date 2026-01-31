import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Budget } from '../../../database/entities/budget.entities';
import { Debt } from '../../../database/entities/debts.entities';
import { FinancialInsight } from '../../../database/entities/financial-insight.entities';
import { FinancialReportController } from './financial-report.controller';
import { FinancialReportService } from './financial-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Debt, FinancialInsight])],
  controllers: [FinancialReportController],
  providers: [FinancialReportService],
  exports: [FinancialReportService],
})
export class FinancialReportModule {}
