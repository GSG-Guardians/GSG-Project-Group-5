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

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.balanceHistory, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: BalanceTransactionType })
  type: BalanceTransactionType;

  @Column('numeric', { precision: 14, scale: 2 })
  amount: string;

  @Column('numeric', { name: 'balance_before', precision: 14, scale: 2 })
  balanceBefore: string;

  @Column('numeric', { name: 'balance_after', precision: 14, scale: 2 })
  balanceAfter: string;

  @Column('char', { length: 3 })
  currency: string;

  @Column('varchar', { name: 'entity_type', length: 40, nullable: true })
  entityType: string | null;

  @Column('uuid', { name: 'entity_id', nullable: true })
  entityId: string | null;

  @Column('text', { nullable: true })
  description: string | null;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
