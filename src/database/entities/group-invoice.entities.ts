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
import { GroupInvoiceStatus, ReminderFrequency, SplitMethod } from '../enums';
import { User } from './user.entities';
import { Asset } from './assets.entities';
import { GroupInvoiceShare } from './group-invoice-share.entities';

@Entity({ name: 'group_invoices' })
@Index(['createdByUserId', 'dueDate'])
@Index(['createdByUserId', 'status'])
@Index(['reminderEnabled', 'nextRemindAt'])
@Index(['assetId'])
export class GroupInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId: string;

  @ManyToOne(() => User, (u) => u.groupInvoicesCreated, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @Column({ type: 'varchar', length: 160 })
  title: string;

  @Column({ name: 'amount_total', type: 'numeric', precision: 14, scale: 2 })
  amountTotal: string;

  @Column({ type: 'char', length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: GroupInvoiceStatus,
    default: GroupInvoiceStatus.UNPAID,
  })
  status: GroupInvoiceStatus;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: string;

  @Column({
    name: 'split_method',
    type: 'enum',
    enum: SplitMethod,
    default: SplitMethod.EQUAL,
  })
  splitMethod: SplitMethod;

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

  @Column({ name: 'asset_id', type: 'uuid', nullable: true })
  assetId: string | null;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset | null;

  @OneToMany(() => GroupInvoiceShare, (s) => s.groupInvoice)
  shares: GroupInvoiceShare[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
