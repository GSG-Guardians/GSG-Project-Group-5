import { DataSource, Between } from 'typeorm';
import { dataSourceOptions } from './database/data-source';
import { User } from './database/entities/user.entities';
import { Income } from './database/entities/income.entities';
import { Expense } from './database/entities/expense.entities';
import { Debt } from './database/entities/debts.entities';
import { Budget } from './database/entities/budget.entities';
import { Bill } from './database/entities/bills.entities';

const debugSummaries = async () => {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  try {
    const userRepo = dataSource.getRepository(User);
    const incomeRepo = dataSource.getRepository(Income);
    const expenseRepo = dataSource.getRepository(Expense);
    const debtRepo = dataSource.getRepository(Debt);
    const budgetRepo = dataSource.getRepository(Budget);
    const billRepo = dataSource.getRepository(Bill);

    const email = 'moaamenalyazouri@gmail.com';
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      console.log('User not found');
      return;
    }
    console.log(`User found: ${user.id}`);

    const date = new Date(); // Today (Feb 2026)

    // Simulate Service Logic for "Previous Month" (Jan 2026)
    const targetDate = new Date(date);
    targetDate.setMonth(targetDate.getMonth() - 1);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const formatDate = (d: Date) =>
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0');

    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    console.log(`Querying range: ${startStr} to ${endStr}`);

    // Check Incomes
    const incomes = await incomeRepo.find({
      where: {
        userId: user.id,
        incomeDate: Between(startStr, endStr),
      },
      order: { incomeDate: 'DESC' },
    });
    console.log(`Incomes found: ${incomes.length}`);
    incomes.forEach((i) =>
      console.log(` - Income: ${i.incomeDate} | ${i.amount}`),
    );

    // Check all incomes for user to see dates
    const allIncomes = await incomeRepo.find({ where: { userId: user.id } });
    console.log(`All Incomes for user: ${allIncomes.length}`);
    allIncomes.forEach((i) =>
      console.log(` - All Income: ${i.incomeDate} | ${i.amount}`),
    );

    // Check Expenses
    const expenses = await expenseRepo.find({
      where: {
        userId: user.id,
        dueDate: Between(startStr, endStr),
      },
      order: { dueDate: 'DESC' },
    });
    console.log(`Expenses found: ${expenses.length}`);
    expenses.forEach((e) =>
      console.log(` - Expense: ${e.dueDate} | ${e.amount}`),
    );
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await dataSource.destroy();
  }
};

debugSummaries();
