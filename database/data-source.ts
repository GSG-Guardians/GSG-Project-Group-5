import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { Asset } from './entities/assets.entities';
import { BalanceHistory } from './entities/balance-history.entities';
import { Bill } from './entities/bills.entities';
import { Budget } from './entities/budget.entities';
import { Currency } from './entities/currency.entities';
import { Debt } from './entities/debts.entities';
import { EmailVerificationCode } from './entities/email-verification-code.entities';
import { Expense } from './entities/expense.entities';
import { FinancialInsight } from './entities/financial-insight.entities';
import { GroupInvoice } from './entities/group-invoice.entities';
import { GroupInvoiceShare } from './entities/group-invoice-share.entities';
import { GroupInvoiceShareItem } from './entities/group-invoice-share-item.entities';
import { Income } from './entities/income.entities';
import { IncomeRecurringRule } from './entities/income-recurring-rule.entities';
import { Notification } from './entities/notifications.entities';
import { PasswordResetCode } from './entities/password-reset-code.entities';
import { Reminder } from './entities/reminders.entities';
import { Reward } from './entities/reward.entities';
import { User } from './entities/user.entities';
import { UserReward } from './entities/user-rewards.entities';

config({ path: '.env' });
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [
    Asset,
    BalanceHistory,
    Bill,
    Budget,
    Currency,
    Debt,
    EmailVerificationCode,
    Expense,
    FinancialInsight,
    GroupInvoice,
    GroupInvoiceShare,
    GroupInvoiceShareItem,
    Income,
    IncomeRecurringRule,
    Notification,
    PasswordResetCode,
    Reminder,
    Reward,
    User,
    UserReward,
  ],
  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],
  synchronize: false,
};
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
