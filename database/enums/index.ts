export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum GroupInvoiceStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

export enum AssetOwnerType {
  USER = 'USER',
  DEBT = 'DEBT',
  BILL = 'BILL',
  EXPENSE = 'EXPENSE',
  GROUP_INVOICE = 'GROUP_INVOICE',
  INCOME = 'INCOME',
  REWARD = 'REWARD',
}

export enum DebtDirection {
  I_OWE = 'I_OWE',
  OWED_TO_ME = 'OWED_TO_ME',
}

export enum DebtStatus {
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  UNPAID = 'UNPAID',
}

export enum BillStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

export enum ReminderFrequency {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum SplitMethod {
  EQUAL = 'EQUAL',
  CUSTOM_AMOUNT = 'CUSTOM_AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
  ONE_PAYS = 'ONE_PAYS',
  EXACT = 'EXACT',
}

export enum CategoryName {
  FOOD = 'FOOD',
  HEALTH = 'HEALTH',
  ENTERTAINMENT = 'ENTERTAINMENT',
  TRANSPORT = 'TRANSPORT',
  HOUSING = 'HOUSING',
  OTHER = 'OTHER',
}

export enum IncomeSource {
  SALARY = 'SALARY',
  FREELANCE = 'FREELANCE',
  BUSINESS = 'BUSINESS',
  INVESTMENT = 'INVESTMENT',
  BONUS = 'BONUS',
  GIFT = 'GIFT',
  OTHER = 'OTHER',
}

export enum IncomeFrequency {
  ONE_TIME = 'ONE_TIME',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum NotificationType {
  BILL_REMINDER = 'BILL_REMINDER',
  DEBT_REMINDER = 'DEBT_REMINDER',
  GROUP_INVOICE_REMINDER = 'GROUP_INVOICE_REMINDER',
  INCOME_REMINDER = 'INCOME_REMINDER',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  SYSTEM = 'SYSTEM',
}

export enum BalanceTransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  DEBT_PAYMENT = 'DEBT_PAYMENT',
  DEBT_RECEIVED = 'DEBT_RECEIVED',
  BILL_PAYMENT = 'BILL_PAYMENT',
  GROUP_INVOICE_PAYMENT = 'GROUP_INVOICE_PAYMENT',
}

export enum RewardStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  OVERDUE = 'OVERDUE',
  PARTIAL = 'PARTIAL',
}

export enum BudgetCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTH = 'HEALTH',
  SHOPPING = 'SHOPPING',
  OTHERS = 'OTHERS',
}

export enum DebtType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
}

export enum ChatRole {
  USER = 'USER',
  AGENT = 'AGENT',
}
