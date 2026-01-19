import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from './entities/user.entities';
import { Asset } from './entities/assets.entities';
import { BalanceHistory } from './entities/balance-history.entities';
import { Bill } from './entities/bills.entities';
import { Debt } from './entities/debts.entities';
import { EmailVerificationCode } from './entities/email-verification-code.entities';
import { Expense } from './entities/expense.entities';
import { GroupInvoice } from './entities/group-invoice.entities';
import { GroupInvoiceShare } from './entities/group-invoice-share.entities';
import { Income } from './entities/income.entities';
import { IncomeRecurringRule } from './entities/income-recurring-rule.entities';
import { PasswordResetCode } from './entities/password-reset-code.entities';
import { Reward } from './entities/reward.entities';
import { UserReward } from './entities/user-rewards.entities';
import { Notification } from './entities/notifications.entities';

config({ path: '.env' });
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [
    User,
    Asset,
    BalanceHistory,
    Bill,
    Debt,
    EmailVerificationCode,
    Expense,
    GroupInvoice,
    GroupInvoiceShare,
    Income,
    IncomeRecurringRule,
    Notification,
    PasswordResetCode,
    Reward,
    UserReward,
  ],
  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],
  synchronize: false,
};
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
