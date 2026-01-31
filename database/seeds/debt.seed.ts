import { DataSource } from 'typeorm';
import { Debt } from '../entities/debts.entities';

export async function seedDebts(dataSource: DataSource): Promise<void> {
  const debtRepo = dataSource.getRepository(Debt);

  // Clear existing debts
  await debtRepo.delete({});

  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + 30);

  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 15);

  const debts = [
    // Debts I owe to others
    {
      userId: 'temp-user-id',
      personalName: 'John Smith',
      direction: 'I_OWE',
      amount: 500.0,
      currencyId: 1, // USD (assuming currency with id 1 exists)
      dueDate: futureDate,
      description: 'Borrowed for car repair',
      status: 'UNPAID',
      reminderEnabled: true,
      remindAt: new Date(futureDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days before
      assetId: null,
    },
    {
      userId: 'temp-user-id',
      personalName: 'Sarah Johnson',
      direction: 'I_OWE',
      amount: 250.0,
      currencyId: 1,
      dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
      description: 'Rent split',
      status: 'PARTIALLY_PAID',
      reminderEnabled: true,
      remindAt: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000),
      assetId: null,
    },
    {
      userId: 'temp-user-id',
      personalName: 'Mike Wilson',
      direction: 'I_OWE',
      amount: 100.0,
      currencyId: 1,
      dueDate: pastDate,
      description: 'Dinner expenses',
      status: 'PAID',
      reminderEnabled: false,
      remindAt: null,
      assetId: null,
    },
    {
      userId: 'temp-user-id',
      personalName: 'Credit Card Company',
      direction: 'I_OWE',
      amount: 1500.0,
      currencyId: 1,
      dueDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      description: 'Monthly credit card payment',
      status: 'UNPAID',
      reminderEnabled: true,
      remindAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
      assetId: null,
    },

    // Debts owed to me
    {
      userId: 'temp-user-id',
      personalName: 'Emily Brown',
      direction: 'OWED_TO_ME',
      amount: 300.0,
      currencyId: 1,
      dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      description: 'Lent for emergency',
      status: 'UNPAID',
      reminderEnabled: true,
      remindAt: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
      assetId: null,
    },
    {
      userId: 'temp-user-id',
      personalName: 'David Lee',
      direction: 'OWED_TO_ME',
      amount: 450.0,
      currencyId: 1,
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      description: 'Shared vacation expenses',
      status: 'PARTIALLY_PAID',
      reminderEnabled: true,
      remindAt: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      assetId: null,
    },
    {
      userId: 'temp-user-id',
      personalName: 'Lisa Martinez',
      direction: 'OWED_TO_ME',
      amount: 75.0,
      currencyId: 1,
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      description: 'Coffee and snacks',
      status: 'UNPAID',
      reminderEnabled: false,
      remindAt: null,
      assetId: null,
    },
    {
      userId: 'temp-user-id',
      personalName: 'Tom Anderson',
      direction: 'OWED_TO_ME',
      amount: 200.0,
      currencyId: 1,
      dueDate: pastDate,
      description: 'Freelance work payment',
      status: 'PAID',
      reminderEnabled: false,
      remindAt: null,
      assetId: null,
    },

    // Overdue debts
    {
      userId: 'temp-user-id',
      personalName: 'Jessica Taylor',
      direction: 'I_OWE',
      amount: 180.0,
      currencyId: 1,
      dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      description: 'Concert tickets',
      status: 'OVERDUE',
      reminderEnabled: true,
      remindAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      assetId: null,
    },
    {
      userId: 'temp-user-id',
      personalName: 'Robert Garcia',
      direction: 'OWED_TO_ME',
      amount: 350.0,
      currencyId: 1,
      dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      description: 'Equipment rental',
      status: 'OVERDUE',
      reminderEnabled: true,
      remindAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      assetId: null,
    },
  ];

  await debtRepo.save(debts);
  console.log('✅ Debt seed data created successfully!');
}
