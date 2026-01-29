import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole, UserStatus } from '../enums';
import { Asset } from './assets.entities';
import { EmailVerificationCode } from './email-verification-code.entities';
import { PasswordResetCode } from './password-reset-code.entities';
import { BalanceHistory } from './balance-history.entities';
import { Debt } from './debts.entities';
import { Bill } from './bills.entities';
import { Expense } from './expense.entities';
import { Income } from './income.entities';
import { GroupInvoice } from './group-invoice.entities';
import { GroupInvoiceShare } from './group-invoice-share.entities';
import { Notification } from './notifications.entities';
import { UserReward } from './user-rewards.entities';
import { Currency } from './currency.entities';

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
@Index(['status'])
@Index(['role'])
@Index(['points'])
@Index(['avatarAssetId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'full_name', length: 120 })
  fullName: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 20, nullable: true, unique: true })
  @Index()
  phone: string | null;

  @Column('varchar', { name: 'password_hash', length: 255, nullable: true })
  passwordHash: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column('uuid', { name: 'default_currency_id', nullable: true })
  defaultCurrencyId: string | null;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'default_currency_id' })
  defaultCurrency: Currency;

  @Column('numeric', {
    name: 'current_balance',
    precision: 14,
    scale: 2,
    default: 0,
  })
  currentBalance: string;

  @Column('bigint', { default: 0 })
  points: string;

  @Column('uuid', { name: 'avatar_asset_id', nullable: true })
  avatarAssetId: string | null;

  @OneToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'avatar_asset_id' })
  avatarAsset?: Asset | null;

  @Column('varchar', { length: 20, default: 'LOCAL' })
  provider: string;

  @Column('varchar', { name: 'provider_id', length: 255, nullable: true })
  providerId: string | null;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  // relations
  @OneToMany(() => Asset, (a) => a.user) assets: Asset[];

  @OneToMany(() => EmailVerificationCode, (c) => c.user)
  emailCodes: EmailVerificationCode[];
  @OneToMany(() => PasswordResetCode, (c) => c.user)
  resetCodes: PasswordResetCode[];

  @OneToMany(() => BalanceHistory, (b) => b.user)
  balanceHistory: BalanceHistory[];

  @OneToMany(() => Debt, (d) => d.user) debts: Debt[];
  @OneToMany(() => Bill, (b) => b.user) bills: Bill[];
  @OneToMany(() => Expense, (e) => e.user) expenses: Expense[];
  @OneToMany(() => Income, (i) => i.user) incomes: Income[];

  @OneToMany(() => GroupInvoice, (gi) => gi.createdByUser)
  createdGroupInvoices: GroupInvoice[];
  @OneToMany(() => GroupInvoiceShare, (s) => s.user)
  groupInvoiceShares: GroupInvoiceShare[];

  @OneToMany(() => Notification, (n) => n.user) notifications: Notification[];

  @OneToMany(() => UserReward, (ur) => ur.user) rewards: UserReward[];
}
