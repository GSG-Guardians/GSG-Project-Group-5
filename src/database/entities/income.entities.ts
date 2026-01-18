import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IncomeSource } from '../enums';
import { User } from './user.entities';
import { Asset } from './assets.entities';
import { IncomeRecurringRule } from './income-recurring-rule.entities';

@Entity({ name: 'incomes' })
@Index(['userId', 'incomeDate'])
@Index(['userId', 'source'])
@Index(['assetId'])
export class Income {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (u) => u.incomes, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: IncomeSource, default: IncomeSource.SALARY })
  source: IncomeSource;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'income_date', type: 'date' })
  incomeDate: string;

  @Column({ name: 'asset_id', type: 'uuid', nullable: true })
  assetId: string | null;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset | null;

  // If you want 1 rule per income (recommended):
  @OneToOne(() => IncomeRecurringRule, (r) => r.income)
  recurringRule: IncomeRecurringRule | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
