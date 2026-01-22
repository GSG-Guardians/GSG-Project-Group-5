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
import { GroupInvoiceStatus, ReminderFrequency, SplitMethod } from '../enums';
import { User } from './user.entities';
import { Asset } from './assets.entities';
import { GroupInvoiceShare } from './group-invoice-share.entities';
import { Reminder } from './reminders.entities';

@Entity({ name: 'group_invoices' })
@Index(['createdByUserId', 'dueDate'])
@Index(['createdByUserId', 'status'])
@Index(['assetId'])
export class GroupInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'created_by_user_id' })
  createdByUserId: string;

  @ManyToOne(() => User, (u) => u.createdGroupInvoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @Column('varchar', { length: 160 })
  title: string;

  @Column('numeric', { name: 'amount_total', precision: 14, scale: 2 })
  amountTotal: string;

  @Column('char', { length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: GroupInvoiceStatus,
    default: GroupInvoiceStatus.UNPAID,
  })
  status: GroupInvoiceStatus;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: string;

  @Column({
    type: 'enum',
    enum: SplitMethod,
    name: 'split_method',
    default: SplitMethod.EQUAL,
  })
  splitMethod: SplitMethod;

  @Column('text', { nullable: true })
  description: string | null;

  @OneToOne(() => Reminder, (reminder) => reminder.groupInvoice, { nullable: true })
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

  @OneToMany(() => GroupInvoiceShare, (s) => s.groupInvoice)
  shares: GroupInvoiceShare[];
}
