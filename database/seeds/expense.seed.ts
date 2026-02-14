import { DataSource } from 'typeorm';
import { Expense } from '../entities/expense.entities';
import { User } from '../entities/user.entities';
import { Currency } from '../entities/currency.entities';
import { CategoryName } from '../enums';

export async function seedExpenses(dataSource: DataSource): Promise<void> {
  const expenseRepo = dataSource.getRepository(Expense);
  const userRepo = dataSource.getRepository(User);
  const currencyRepo = dataSource.getRepository(Currency);

  const adminUser = await userRepo.findOne({
    where: { email: 'admin@email.com' },
  });

  if (!adminUser) {
    console.log('⚠️  Expense seed skipped - admin user not found');
    return;
  }

  const usdCurrency = await currencyRepo.findOne({
    where: { code: 'USD' },
  });

  if (!usdCurrency) {
    console.log('⚠️  Expense seed skipped - USD currency not found');
    return;
  }

  await expenseRepo.delete({ userId: adminUser.id });

  const now = new Date();
  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const expenses = [
    {
      userId: adminUser.id,
      name: 'Grocery Shopping',
      amount: '150.75',
      currencyId: usdCurrency.id,
      category: CategoryName.FOOD,
      dueDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 2)),
      description: 'Weekly groceries',
      createdAt: new Date(now.getFullYear(), now.getMonth(), 2),
    },
    {
      userId: adminUser.id,
      name: 'Uber Ride',
      amount: '25.50',
      currencyId: usdCurrency.id,
      category: CategoryName.TRANSPORT,
      dueDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 5)),
      description: 'Ride to airport',
      createdAt: new Date(now.getFullYear(), now.getMonth(), 5),
    },
    {
      userId: adminUser.id,
      name: 'Cinema Tickets',
      amount: '30.00',
      currencyId: usdCurrency.id,
      category: CategoryName.ENTERTAINMENT,
      dueDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 10)),
      description: 'Movie night',
      createdAt: new Date(now.getFullYear(), now.getMonth(), 10),
    },
    {
      userId: adminUser.id,
      name: 'Pharmacy',
      amount: '45.20',
      currencyId: usdCurrency.id,
      category: CategoryName.HEALTH,
      dueDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 15)),
      description: 'Vitamins and supplements',
      createdAt: new Date(now.getFullYear(), now.getMonth(), 15),
    },
  ];

  await expenseRepo.save(expenses);
  console.log('✅ Expense seed data created successfully!');
}
