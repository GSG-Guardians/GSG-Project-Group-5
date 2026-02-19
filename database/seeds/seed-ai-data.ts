import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { User } from '../entities/user.entities';
import { Income } from '../entities/income.entities';
import { Expense } from '../entities/expense.entities';
import { Debt } from '../entities/debts.entities';
import { Budget } from '../entities/budget.entities';
import { Bill } from '../entities/bills.entities';
import { Currency } from '../entities/currency.entities';
import {
  CategoryName,
  DebtDirection,
  BillStatus,
  DebtStatus,
  BudgetCategory,
  IncomeSource,
  UserRole,
  UserStatus,
} from '../enums';
import * as argon from 'argon2';

console.log('Seed script loaded.');

if (!dataSourceOptions) {
  console.error('Data source options are missing!');
  process.exit(1);
}

const seedAiData = async () => {
  console.log('Starting seedAiData function...');
  const dataSource = new DataSource(dataSourceOptions);

  try {
    console.log('Initializing DataSource...');
    await dataSource.initialize();
    console.log('DataSource initialized.');
  } catch (e) {
    console.error('Failed to initialize DataSource:', e);
    process.exit(1);
  }

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  console.log('Transaction started.');

  try {
    const userRepo = queryRunner.manager.getRepository(User);
    const incomeRepo = queryRunner.manager.getRepository(Income);
    const expenseRepo = queryRunner.manager.getRepository(Expense);
    const debtRepo = queryRunner.manager.getRepository(Debt);
    const budgetRepo = queryRunner.manager.getRepository(Budget);
    const billRepo = queryRunner.manager.getRepository(Bill);
    const currencyRepo = queryRunner.manager.getRepository(Currency);

    const email = 'moaamenalyazouri@gmail.com';
    console.log(`Finding user with email: ${email}`);
    let user = await userRepo.findOne({ where: { email } });

    if (!user) {
      console.log(`User with email ${email} not found. Creating user...`);

      const usd = await currencyRepo.findOne({ where: { code: 'USD' } });
      if (!usd) {
        throw new Error('USD currency not found!');
      }

      const hashedPassword = await argon.hash('123456');

      user = userRepo.create({
        fullName: 'Moamen Alyazouri',
        email: email,
        passwordHash: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        defaultCurrencyId: usd.id,
        provider: 'LOCAL',
        currentBalance: '0',
        points: '0',
      });

      await userRepo.save(user);
      console.log(`User created: ${user.id}`);
    } else {
      console.log(
        `User found: ${user.id}, Currency: ${user.defaultCurrencyId}`,
      );
    }

    const currencyId = user.defaultCurrencyId;

    // Dates in Jan 2026
    const jan15 = new Date('2026-01-15T12:00:00Z');
    const jan05 = new Date('2026-01-05T10:00:00Z');
    const jan20 = new Date('2026-01-20T15:00:00Z');
    const jan01 = new Date('2026-01-01T00:00:00Z');
    const jan31 = new Date('2026-01-31T23:59:59Z');

    // Helper to format date as YYYY-MM-DD for string fields
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // 1. Income
    console.log('Seeding Income...');
    // Income entity uses string for incomeDate
    const income = incomeRepo.create({
      userId: user.id,
      amount: '5000.00',
      currencyId: currencyId,
      source: IncomeSource.SALARY,
      description: 'Monthly salary',
      incomeDate: formatDate(jan15),
    });
    await incomeRepo.save(income);
    console.log('Seeded Income: Salary');

    // 2. Expenses
    console.log('Seeding Expenses...');
    // Expense entity uses string for dueDate
    const expense1 = expenseRepo.create({
      userId: user.id,
      name: 'Rent',
      amount: '1200.00',
      currencyId: currencyId,
      category: CategoryName.HOUSING,
      dueDate: formatDate(jan01),
      description: 'January Rent',
    });

    const expense2 = expenseRepo.create({
      userId: user.id,
      name: 'Groceries',
      amount: '350.50',
      currencyId: currencyId,
      category: CategoryName.FOOD,
      dueDate: formatDate(jan05),
      description: 'Weekly groceries',
    });
    await expenseRepo.save([expense1, expense2]);
    console.log('Seeded Expenses: Rent, Groceries');

    // 3. Debt
    console.log('Seeding Debt...');
    // Debt entity uses string for dueDate
    const debt = debtRepo.create({
      userId: user.id,
      personalName: 'John Doe',
      direction: DebtDirection.OWED_TO_ME,
      amount: '150.00',
      currencyId: currencyId,
      dueDate: formatDate(jan20),
      description: 'Lunch money',
      status: DebtStatus.UNPAID,
    });
    await debtRepo.save(debt);
    console.log('Seeded Debt: Owed to me');

    // 4. Budget
    console.log('Seeding Budget...');
    // Budget entity uses Date object for start_date/end_date
    const budget = budgetRepo.create({
      user_id: user.id, // Explicitly using user_id as per entity column
      category: BudgetCategory.ENTERTAINMENT,
      allocated_amount: 500.0,
      spent_amount: 120.0, // Partial spend
      start_date: jan01,
      end_date: jan31,
      notes: 'January Entertainment Budget',
      is_active: true,
    });
    // Note: TypeORM might complain if relation 'user' is missing but we provide user_id.
    // To be safe, let's also pass the user object dummy or just rely on user_id if allowed.
    // Entity says: @Column({ name: 'user_id' }) user_id: string.
    // And @ManyToOne ... user: User.
    // Usually providing just user_id is enough if the column exists.

    await budgetRepo.save(budget);
    console.log('Seeded Budget: Entertainment');

    // 5. Bill
    console.log('Seeding Bill...');
    // Bill entity uses string for dueDate
    const bill = billRepo.create({
      userId: user.id,
      name: 'Electricity',
      amount: '85.00',
      dueDate: formatDate(jan20),
      currencyId: currencyId,
      description: 'Jan Electricity Bill',
      status: BillStatus.UNPAID,
    });
    await billRepo.save(bill);
    console.log('Seeded Bill: Electricity');

    // 6. Current Month (Feb 2026) Data
    const feb15 = new Date('2026-02-15T12:00:00Z');
    console.log('Seeding Feb Income...');
    const incomeFeb = incomeRepo.create({
      userId: user.id,
      amount: '5500.00',
      currencyId: currencyId,
      source: IncomeSource.SALARY,
      description: 'February Salary (Bonus included)',
      incomeDate: formatDate(feb15),
    });
    await incomeRepo.save(incomeFeb);
    console.log('Seeded Feb Income: Salary');

    await queryRunner.commitTransaction();
    console.log('AI Data Seed completed successfully!');
  } catch (err) {
    console.error('Error block reached!');
    if (queryRunner.isTransactionActive) {
      console.log('Rolling back transaction...');
      await queryRunner.rollbackTransaction();
      console.log('Rollback complete.');
    }
    console.error('Error during AI Data seed:', err);
    process.exit(1);
  } finally {
    if (!queryRunner.isReleased) {
      await queryRunner.release();
    }
    await dataSource.destroy();
    console.log('DataSource destroyed. Cleanup complete.');
  }
};

seedAiData().catch((e) => {
  console.error('Unhandled error in seed function:', e);
  process.exit(1);
});
