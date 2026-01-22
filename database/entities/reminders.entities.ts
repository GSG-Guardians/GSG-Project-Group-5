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
import { ReminderFrequency } from '../enums';
import { User } from './user.entities';
import { Debt } from './debts.entities';
import { Bill } from './bills.entities';
import { Expense } from './expense.entities';
import { GroupInvoice } from './group-invoice.entities';

@Entity({ name: 'reminders' })
@Index(['userId', 'dueDate'])
@Index(['userId', 'isActive'])
@Index(['isActive', 'nextRemindAt'])
@Index(['frequency'])
export class Reminder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'date', name: 'due_date' })
    dueDate: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'boolean', name: 'is_active', default: true })
    isActive: boolean;

    @Column({
        type: 'enum',
        enum: ReminderFrequency,
        default: ReminderFrequency.NONE,
    })
    frequency: ReminderFrequency;

    @Column({ type: 'timestamptz', name: 'next_remind_at', nullable: true })
    nextRemindAt: Date | null;

    @Column({ type: 'timestamptz', name: 'last_sent_at', nullable: true })
    lastSentAt: Date | null;

    @Column({
        type: 'timestamptz', name: 'completed_at', nullable: true
    })
    completedAt: Date | null;

    @OneToOne(() => Debt, (debt) => debt.reminder, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'debt_id' })
    debt: Debt | null;

    @Column({ type: 'uuid', name: 'debt_id', nullable: true })
    debtId: string | null;

    @OneToOne(() => Bill, (bill) => bill.reminder, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bill_id' })
    bill: Bill | null;

    @Column({ type: 'uuid', name: 'bill_id', nullable: true })
    billId: string | null;

    @OneToOne(() => Expense, (expense) => expense.reminder, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'expense_id' })
    expense: Expense | null;

    @Column({ type: 'uuid', name: 'expense_id', nullable: true })
    expenseId: string | null;

    @OneToOne(() => GroupInvoice, (groupInvoice) => groupInvoice.reminder, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'group_invoice_id' })
    groupInvoice: GroupInvoice | null;

    @Column({ type: 'uuid', name: 'group_invoice_id', nullable: true })
    groupInvoiceId: string | null;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'now()' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', default: () => 'now()' })
    updatedAt: Date;
}
