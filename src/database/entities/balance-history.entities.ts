import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BalanceTransactionType } from '../enums';
import { User } from './user.entities';

@Entity({ name: 'balance_history' })
@Index(['userId', 'createdAt'])
@Index(['userId', 'type'])
@Index(['entityType', 'entityId'])
export class BalanceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (u) => u.balanceHistory, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: BalanceTransactionType })
  type: BalanceTransactionType;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ name: 'balance_before', type: 'numeric', precision: 14, scale: 2 })
  balanceBefore: string;

  @Column({ name: 'balance_after', type: 'numeric', precision: 14, scale: 2 })
  balanceAfter: string;

  @Column({ type: 'char', length: 3 })
  currency: string;

  @Column({ name: 'entity_type', type: 'varchar', length: 40, nullable: true })
  entityType: string | null;

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entityId: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
