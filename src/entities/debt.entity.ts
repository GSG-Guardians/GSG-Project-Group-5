import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserE } from './user.entity';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { DebtType } from 'src/enums/debt-type.enum';

@Entity('debt')
export class DebtE {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  person_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  payment_status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: DebtType,
    default: DebtType.INDIVIDUAL,
  })
  debt_type: DebtType;

  @Column({ type: 'boolean', default: false })
  reminder_enabled: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  reminder_date?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  group_name?: string;

  @Column({ type: 'int', nullable: true })
  group_members_count?: number;

  // Relationship to User - the user who created/owns this debt
  @ManyToOne(() => UserE, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserE;

  @Column({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt?: Date;
}
