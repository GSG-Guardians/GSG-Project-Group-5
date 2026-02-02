import { DataSource } from 'typeorm';
import { Debt } from '../entities/debts.entities';
import { User } from '../entities/user.entities';
import { Currency } from '../entities/currency.entities';
import { DebtDirection, DebtStatus } from '../enums';

export async function seedDebts(dataSource: DataSource): Promise<void> {
  const debtRepo = dataSource.getRepository(Debt);
  const userRepo = dataSource.getRepository(User);
  const currencyRepo = dataSource.getRepository(Currency);

  // Get the admin user and USD currency
  const adminUser = await userRepo.findOne({
    where: { email: 'admin@email.com' },
  });
  const usdCurrency = await currencyRepo.findOne({ where: { code: 'USD' } });

  if (!adminUser || !usdCurrency) {
    console.log('⚠️  Debt seed skipped - admin user or USD currency not found');
    return;
  }

  // Clear existing debts for admin user
  await debtRepo.delete({ userId: adminUser.id });

  const now = new Date();
  const futureDate30 = new Date();
  futureDate30.setDate(now.getDate() + 30);

  const futureDate15 = new Date();
  futureDate15.setDate(now.getDate() + 15);

  const futureDate7 = new Date();
  futureDate7.setDate(now.getDate() + 7);

  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 15);

  const debts = [
    // Money I owe to others
    {
      userId: adminUser.id,
      personalName: 'John Doe',
      direction: DebtDirection.I_OWE,
      amount: '500.00',
      currencyId: usdCurrency.id,
      dueDate: futureDate15.toISOString().split('T')[0],
      description: 'Borrowed for laptop repair',
      status: DebtStatus.UNPAID,
      reminderEnabled: true,
      remindAt: new Date(futureDate15.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      personalName: 'Sarah Wilson',
      direction: DebtDirection.I_OWE,
      amount: '300.00',
      currencyId: usdCurrency.id,
      dueDate: futureDate7.toISOString().split('T')[0],
      description: 'Shared rent payment',
      status: DebtStatus.UNPAID,
      reminderEnabled: true,
      remindAt: new Date(futureDate7.getTime() - 48 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      personalName: 'Mike Johnson',
      direction: DebtDirection.I_OWE,
      amount: '150.00',
      currencyId: usdCurrency.id,
      dueDate: pastDate.toISOString().split('T')[0],
      description: 'Concert tickets',
      status: DebtStatus.OVERDUE,
      reminderEnabled: false,
      remindAt: null,
    },

    // Money others owe to me
    {
      userId: adminUser.id,
      personalName: 'Emily Brown',
      direction: DebtDirection.OWED_TO_ME,
      amount: '750.00',
      currencyId: usdCurrency.id,
      dueDate: futureDate30.toISOString().split('T')[0],
      description: 'Lent money for car down payment',
      status: DebtStatus.UNPAID,
      reminderEnabled: true,
      remindAt: new Date(futureDate30.getTime() - 72 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      personalName: 'David Lee',
      direction: DebtDirection.OWED_TO_ME,
      amount: '200.00',
      currencyId: usdCurrency.id,
      dueDate: futureDate15.toISOString().split('T')[0],
      description: 'Shared vacation expenses',
      status: DebtStatus.UNPAID,
      reminderEnabled: false,
      remindAt: null,
    },
    {
      userId: adminUser.id,
      personalName: 'Jessica Taylor',
      direction: DebtDirection.OWED_TO_ME,
      amount: '450.00',
      currencyId: usdCurrency.id,
      dueDate: now.toISOString().split('T')[0],
      description: 'Freelance project payment',
      status: DebtStatus.PAID,
      reminderEnabled: false,
      remindAt: null,
    },

    // Additional debts for testing
    {
      userId: adminUser.id,
      personalName: 'Alex Martinez',
      direction: DebtDirection.I_OWE,
      amount: '1200.00',
      currencyId: usdCurrency.id,
      dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      description: 'Personal loan for emergency',
      status: DebtStatus.UNPAID,
      reminderEnabled: true,
      remindAt: new Date(now.getTime() + 57 * 24 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      personalName: 'Rachel Green',
      direction: DebtDirection.OWED_TO_ME,
      amount: '85.50',
      currencyId: usdCurrency.id,
      dueDate: futureDate7.toISOString().split('T')[0],
      description: 'Dinner split',
      status: DebtStatus.UNPAID,
      reminderEnabled: false,
      remindAt: null,
    },
  ];

  await debtRepo.save(debts);
  console.log('✅ Debt seed data created successfully!');
}
