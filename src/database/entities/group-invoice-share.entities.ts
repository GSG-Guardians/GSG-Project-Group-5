import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';
import { GroupInvoice } from './group-invoice.entities';

@Entity({ name: 'group_invoice_shares' })
@Index(['groupInvoiceId', 'userId'], { unique: true })
@Index(['userId'])
export class GroupInvoiceShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_invoice_id', type: 'uuid' })
  groupInvoiceId: string;

  @ManyToOne(() => GroupInvoice, (gi) => gi.shares, { onDelete: 'CASCADE' })
  groupInvoice: GroupInvoice;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (u) => u.groupInvoiceShares, { onDelete: 'NO ACTION' })
  user: User;

  @Column({ name: 'amount_share', type: 'numeric', precision: 14, scale: 2 })
  amountShare: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  percentage: string | null;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
