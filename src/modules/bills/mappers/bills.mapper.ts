import { Bill } from '../../../../database/entities/bills.entities';
import { GroupInvoice } from '../../../../database/entities/group-invoice.entities';
import { BillStatus, GroupInvoiceStatus } from '../../../../database/enums';
import { TMonthlyBillSummary } from '../bills.types';

export function toMonthlyBillSummary(bill: Bill): TMonthlyBillSummary {
  return {
    name: bill.name,
    amount: bill.amount,
    dueDate: bill.dueDate,
    type: 'individual',
    status: bill.status === BillStatus.PAID ? 'paid' : 'unpaid',
  };
}

export function toMonthlyGroupBillSummary(
  invoice: GroupInvoice,
): TMonthlyBillSummary {
  return {
    name: invoice.title,
    amount: invoice.amountTotal,
    dueDate: invoice.dueDate,
    type: 'group',
    status: invoice.status === GroupInvoiceStatus.PAID ? 'paid' : 'unpaid',
  };
}
