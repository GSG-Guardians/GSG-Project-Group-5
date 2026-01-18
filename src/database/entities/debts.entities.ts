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
import { DebtDirection, DebtStatus } from '../enums';
import { User } from './user.entities';
import { Asset } from './assets.entities';

@Entity({ name: 'debts' })
@Index(['userId', 'status'])
@Index(['userId', 'dueDate'])
@Index(['reminderEnabled', 'remindAt'])
@Index(['assetId'])
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (u) => u.debts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ name: 'personal_name', type: 'varchar', length: 160 })
  personalName: string;

  @Column({ type: 'enum', enum: DebtDirection, default: DebtDirection.I_OWE })
  direction: DebtDirection;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ type: 'char', length: 3 })
  currency: string;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: string; // YYYY-MM-DD

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // NOTE: DBML default was 'OPEN' but enum doesn't include it
  @Column({ type: 'enum', enum: DebtStatus, default: DebtStatus.UNPAID })
  status: DebtStatus;

  @Column({ name: 'reminder_enabled', type: 'boolean', default: false })
  reminderEnabled: boolean;

  @Column({ name: 'remind_at', type: 'timestamptz', nullable: true })
  remindAt: Date | null;

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
