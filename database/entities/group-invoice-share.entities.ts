import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupInvoice } from './group-invoice.entities';
import { User } from './user.entities';

@Entity({ name: 'group_invoice_shares' })
@Index(['groupInvoiceId', 'userId'], { unique: true })
@Index(['userId'])
export class GroupInvoiceShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'group_invoice_id' })
  groupInvoiceId: string;

  @ManyToOne(() => GroupInvoice, (gi) => gi.shares, { onDelete: 'CASCADE' })
  groupInvoice: GroupInvoice;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.groupInvoiceShares)
  user: User;

  @Column('numeric', { name: 'amount_share', precision: 14, scale: 2 })
  amountShare: string;

  @Column('numeric', { precision: 5, scale: 2, nullable: true })
  percentage: string | null;

  @Column({ type: 'timestamptz', name: 'paid_at', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
