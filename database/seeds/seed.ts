import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { seedUsers } from './user.seed';
import { seedBudgets } from './budget.seed';
import { seedDebts } from './debt.seed';
import { seedFinancialInsights } from './financial-insight.seed';
import { seedIncomes } from './income.seed';
import { seedExpenses } from './expense.seed';
import { seedBills } from './bill.seed';

const main = async () => {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  console.log('Main seed started...');

  try {
    // Run all seeds here (except currency)
    await seedUsers(dataSource);
    await seedBudgets(dataSource);
    await seedDebts(dataSource);
    await seedFinancialInsights(dataSource);
    await seedIncomes(dataSource);
    await seedExpenses(dataSource);
    await seedBills(dataSource);

    console.log('Main seed completed successfully!');
  } catch (err) {
    console.error('Error during main seed:', err);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
};

main();
