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
import { BillStatus } from '../enums';
import { User } from './user.entities';
import { Asset } from './assets.entities';
import { Reminder } from './reminders.entities';
import { Currency } from './currency.entities';

@Entity({ name: 'bills' })
@Index(['userId', 'dueDate'])
@Index(['userId', 'status'])
@Index(['assetId'])
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.bills, { onDelete: 'CASCADE' })
  user: User;

  @Column('varchar', { length: 160 })
  name: string;

  @Column('numeric', { precision: 14, scale: 2 })
  amount: string;

  @Column('uuid', { name: 'currency_id' })
  currencyId: string;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ type: 'enum', enum: BillStatus, default: BillStatus.UNPAID })
  status: BillStatus;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: string;

  @Column('text', { nullable: true })
  description: string | null;

  @OneToOne(() => Reminder, (reminder) => reminder.bill, { nullable: true })
  reminder: Reminder | null;

  @Column({ type: 'timestamptz', name: 'next_remind_at', nullable: true })
  nextRemindAt: Date | null;

  @Column({ type: 'timestamptz', name: 'paid_at', nullable: true })
  paidAt: Date | null;

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
