import { DataSource } from 'typeorm';
import { Bill } from '../entities/bills.entities';
import { User } from '../entities/user.entities';
import { Currency } from '../entities/currency.entities';
import { BillStatus } from '../enums';

export async function seedBills(dataSource: DataSource): Promise<void> {
  const billRepo = dataSource.getRepository(Bill);
  const userRepo = dataSource.getRepository(User);
  const currencyRepo = dataSource.getRepository(Currency);

  const adminUser = await userRepo.findOne({
    where: { email: 'admin@email.com' },
  });

  if (!adminUser) {
    console.log('⚠️  Bill seed skipped - admin user not found');
    return;
  }

  const usdCurrency = await currencyRepo.findOne({
    where: { code: 'USD' },
  });

  if (!usdCurrency) {
    console.log('⚠️  Bill seed skipped - USD currency not found');
    return;
  }

  await billRepo.delete({ userId: adminUser.id });

  const now = new Date();
  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const bills = [
    {
      userId: adminUser.id,
      name: 'Internet Bill',
      amount: '60.00',
      currencyId: usdCurrency.id,
      status: BillStatus.PAID,
      dueDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)),
      description: 'Monthly Fiber Internet',
      paidAt: new Date(now.getFullYear(), now.getMonth(), 1, 10, 0, 0),
    },
    {
      userId: adminUser.id,
      name: 'Apartment Rent',
      amount: '1200.00',
      currencyId: usdCurrency.id,
      status: BillStatus.UNPAID,
      dueDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 28)),
      description: 'Monthly Rent',
    },
    {
      userId: adminUser.id,
      name: 'Mobile Plan',
      amount: '45.00',
      currencyId: usdCurrency.id,
      status: BillStatus.UNPAID,
      dueDate: formatDate(new Date(now.getFullYear(), now.getMonth(), 25)),
      description: 'Unlimited Data Plan',
    },
  ];

  await billRepo.save(bills);
  console.log('✅ Bill seed data created successfully!');
}
