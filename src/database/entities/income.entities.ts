import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.incomes, { onDelete: 'CASCADE' })
  user: User;

  @Column('numeric', { precision: 14, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: IncomeSource, default: IncomeSource.SALARY })
  source: IncomeSource;

  @Column('text', { nullable: true })
  description: string | null;

  @Column({ type: 'date', name: 'income_date' })
  incomeDate: string;

  @Column('uuid', { name: 'asset_id', nullable: true })
  assetId: string | null;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'asset_id' })
  asset?: Asset | null;

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

  @OneToMany(() => IncomeRecurringRule, (r) => r.income)
  recurringRules: IncomeRecurringRule[];
}
