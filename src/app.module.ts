import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { dataSourceOptions } from '../database/data-source';
import { BillsModule } from './modules/bills/bills.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UnifiedResponseInterceptor } from './interceptors/unifiedResponse.interceptor';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { BudgetModule } from './modules/budget/budget.module';
import { DebtModule } from './modules/debt/debt.module';
import { FinancialReportModule } from './modules/financial-report/financial-report.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { MailModule } from './modules/mail/mail.module';
import { IncomeModule } from './modules/income/income.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { ReminderModule } from './modules/reminder/reminder.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AdminModule } from './modules/admin/admin.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UserModule,
    AuthModule,
    CurrencyModule,
    BudgetModule,
    DebtModule,
    FinancialReportModule,
    ExpensesModule,
    BillsModule,
    MailModule,
    ReminderModule,
    IncomeModule,
    AssetsModule,
    AdminModule,
    HomeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifiedResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
