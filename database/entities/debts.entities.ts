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
import { DebtDirection, DebtStatus } from '../enums';
import { User } from './user.entities';
import { Asset } from './assets.entities';
import { Reminder } from './reminders.entities';

@Entity({ name: 'debts' })
@Index(['userId', 'status'])
@Index(['userId', 'dueDate'])
@Index(['assetId'])
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.debts, { onDelete: 'CASCADE' })
  user: User;

  @Column('varchar', { name: 'personal_name', length: 160 })
  personalName: string;

  @Column({ type: 'enum', enum: DebtDirection, default: DebtDirection.I_OWE })
  direction: DebtDirection;

  @Column('numeric', { precision: 14, scale: 2 })
  amount: string;

  @Column('char', { length: 3 })
  currency: string;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: DebtStatus, default: DebtStatus.UNPAID })
  status: DebtStatus;

  @Column('boolean', { name: 'reminder_enabled', default: false })
  reminderEnabled: boolean;

  @Column({ type: 'timestamptz', name: 'remind_at', nullable: true })
  remindAt: Date | null;

  @OneToOne(() => Reminder, (reminder) => reminder.debt, { nullable: true })
  reminder: Reminder | null;

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
