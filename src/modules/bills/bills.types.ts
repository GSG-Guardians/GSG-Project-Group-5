export type TMonthlyBillSummary = {
  name: string;
  amount: string;
  dueDate: string;
  type: 'individual' | 'group';
  status: 'paid' | 'unpaid';
};
