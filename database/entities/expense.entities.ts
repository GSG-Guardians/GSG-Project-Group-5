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
import { CategoryName, ReminderFrequency } from '../enums';
import { User } from './user.entities';
import { Asset } from './assets.entities';
import { Reminder } from './reminders.entities';

@Entity({ name: 'expenses' })
@Index(['userId', 'dueDate'])
@Index(['userId', 'category'])
@Index(['assetId'])
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.expenses, { onDelete: 'CASCADE' })
  user: User;

  @Column('varchar', { length: 160 })
  name: string;

  @Column('numeric', { precision: 14, scale: 2 })
  amount: string;

  @Column('char', { length: 3 })
  currency: string;

  @Column({ type: 'enum', enum: CategoryName, default: CategoryName.OTHER })
  category: CategoryName;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: string;

  @Column('text', { nullable: true })
  description: string | null;

  @OneToOne(() => Reminder, (reminder) => reminder.expense, { nullable: true })
  reminder: Reminder | null;

  @Column({ type: 'timestamptz', name: 'next_remind_at', nullable: true })
  nextRemindAt: Date | null;

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
}
