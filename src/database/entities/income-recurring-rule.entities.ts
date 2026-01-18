import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IncomeFrequency } from '../enums';
import { Income } from './income.entities';

@Entity({ name: 'income_recurring_rules' })
@Index(['active', 'nextRunAt'])
@Index(['frequency'])
export class IncomeRecurringRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'income_id', type: 'uuid' })
  incomeId: string;

  @OneToOne(() => Income, (i) => i.recurringRule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'income_id' })
  income: Income;

  @Column({
    type: 'enum',
    enum: IncomeFrequency,
    default: IncomeFrequency.ONE_TIME,
  })
  frequency: IncomeFrequency;

  @Column({ name: 'next_run_at', type: 'date' })
  nextRunAt: string;

  @Column({ name: 'end_at', type: 'date', nullable: true })
  endAt: string | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
