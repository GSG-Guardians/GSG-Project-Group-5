import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole, UserStatus } from '../enums';
import { EmailVerificationCode } from './email-verification-code.entities';
import { PasswordResetCode } from './password-reset-code.entities';
import { BalanceHistory } from './balance-history.entities';
import { Asset } from './assets.entities';
import { Debt } from './debts.entities';
import { Bill } from './bills.entities';
import { Expense } from './expense.entities';
import { Income } from './income.entities';
import { Notification } from './notifications.entities';
import { GroupInvoice } from './group-invoice.entities';
import { GroupInvoiceShare } from './group-invoice-share.entities';

@Entity({ name: 'users' })
@Index(['status'])
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 120 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  passwordHash: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ name: 'default_currency', type: 'char', length: 3, default: 'USD' })
  defaultCurrency: string;

  @Column({
    name: 'current_balance',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  currentBalance: string;

  @Column({ type: 'varchar', length: 20, default: 'LOCAL' })
  provider: string;

  @Column({ name: 'provider_id', type: 'varchar', length: 255, nullable: true })
  providerId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => EmailVerificationCode, (x) => x.user)
  emailVerificationCodes: EmailVerificationCode[];

  @OneToMany(() => PasswordResetCode, (x) => x.user)
  passwordResetCodes: PasswordResetCode[];

  @OneToMany(() => BalanceHistory, (x) => x.user)
  balanceHistory: BalanceHistory[];

  @OneToMany(() => Asset, (x) => x.user)
  assets: Asset[];

  @OneToMany(() => Debt, (x) => x.user)
  debts: Debt[];

  @OneToMany(() => Bill, (x) => x.user)
  bills: Bill[];

  @OneToMany(() => Expense, (x) => x.user)
  expenses: Expense[];

  @OneToMany(() => Income, (x) => x.user)
  incomes: Income[];

  @OneToMany(() => Notification, (x) => x.user)
  notifications: Notification[];

  @OneToMany(() => GroupInvoice, (x) => x.createdByUser)
  groupInvoicesCreated: GroupInvoice[];

  @OneToMany(() => GroupInvoiceShare, (x) => x.user)
  groupInvoiceShares: GroupInvoiceShare[];
}
