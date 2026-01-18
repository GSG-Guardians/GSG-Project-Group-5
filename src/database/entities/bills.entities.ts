import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillStatus, ReminderFrequency } from '../enums';
import { User } from './user.entities';
import { Asset } from './assets.entities';

@Entity({ name: 'bills' })
@Index(['userId', 'dueDate'])
@Index(['userId', 'status'])
@Index(['reminderEnabled', 'nextRemindAt'])
@Index(['assetId'])
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (u) => u.bills, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ type: 'char', length: 3 })
  currency: string;

  @Column({ type: 'enum', enum: BillStatus, default: BillStatus.PENDING })
  status: BillStatus;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'reminder_enabled', type: 'boolean', default: false })
  reminderEnabled: boolean;

  @Column({
    name: 'reminder_frequency',
    type: 'enum',
    enum: ReminderFrequency,
    default: ReminderFrequency.NONE,
  })
  reminderFrequency: ReminderFrequency;

  @Column({ name: 'next_remind_at', type: 'timestamptz', nullable: true })
  nextRemindAt: Date | null;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @Column({ name: 'asset_id', type: 'uuid', nullable: true })
  assetId: string | null;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
