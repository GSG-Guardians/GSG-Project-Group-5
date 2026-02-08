import { DataSource } from 'typeorm';
import { Income } from '../entities/income.entities';
import { User } from '../entities/user.entities';
import { Currency } from '../entities/currency.entities';
import { IncomeSource } from '../enums';

export async function seedIncomes(dataSource: DataSource): Promise<void> {
  const incomeRepo = dataSource.getRepository(Income);
  const userRepo = dataSource.getRepository(User);
  const currencyRepo = dataSource.getRepository(Currency);

  const adminUser = await userRepo.findOne({
    where: { email: 'admin@email.com' },
  });

  if (!adminUser) {
    console.log('⚠️  Income seed skipped - admin user not found');
    return;
  }

  const usdCurrency = await currencyRepo.findOne({
    where: { code: 'USD' },
  });

  if (!usdCurrency) {
    console.log('⚠️  Income seed skipped - USD currency not found');
    return;
  }

  await incomeRepo.delete({ userId: adminUser.id });

  const now = new Date();

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 15);

  const incomes = [
    {
      userId: adminUser.id,
      amount: '5000.00',
      currencyId: usdCurrency.id,
      source: IncomeSource.SALARY,
      description: 'Monthly Salary - Last Month',
      incomeDate: formatDate(lastMonth),
      createdAt: lastMonth,
    },
    {
      userId: adminUser.id,
      amount: '5000.00',
      currencyId: usdCurrency.id,
      source: IncomeSource.SALARY,
      description: 'Monthly Salary - Current Month',
      incomeDate: formatDate(currentMonth),
      createdAt: currentMonth,
    },
    {
      userId: adminUser.id,
      amount: '1200.50',
      currencyId: usdCurrency.id,
      source: IncomeSource.FREELANCE,
      description: 'Website Project',
      incomeDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 5)),
      createdAt: new Date(now.getFullYear(), now.getMonth(), 5),
    },
    {
      userId: adminUser.id,
      amount: '500.00',
      currencyId: usdCurrency.id,
      source: IncomeSource.INVESTMENT,
      description: 'Stock Dividends',
      incomeDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 20)),
      createdAt: new Date(now.getFullYear(), now.getMonth(), 20),
    },
  ];

  await incomeRepo.save(incomes);
  console.log('✅ Income seed data created successfully!');
}
