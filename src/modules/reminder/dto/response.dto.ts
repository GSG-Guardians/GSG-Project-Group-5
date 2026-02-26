import { ReminderFrequency } from 'database/enums';

export type ReminderResponseDto = {
  id: string;
  userId: string;
  dueDate: string;
  description: string | null;
  isActive: boolean;
  frequency: ReminderFrequency;
  nextRemindAt: Date | null;
  lastSentAt: Date | null;
  completedAt: Date | null;
  debtId: string | null;
  billId: string | null;
  expenseId: string | null;
  groupInvoiceId: string | null;
  createdAt: Date;
  updatedAt: Date;
};
