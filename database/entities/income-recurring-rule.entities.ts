import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
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

  @Column('uuid', { name: 'income_id' })
  incomeId: string;

  @ManyToOne(() => Income, (i) => i.recurringRules, { onDelete: 'CASCADE' })
  income: Income;

  @Column({
    type: 'enum',
    enum: IncomeFrequency,
    default: IncomeFrequency.ONE_TIME,
  })
  frequency: IncomeFrequency;

  @Column({ type: 'date', name: 'next_run_at' })
  nextRunAt: string;

  @Column({ type: 'date', name: 'end_at', nullable: true })
  endAt: string | null;

  @Column('boolean', { default: true })
  active: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
