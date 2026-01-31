import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { seedUsers } from './user.seed';

const main = async () => {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  console.log('Main seed started...');

  try {
    // Run all seeds here (except currency)
    await seedUsers(dataSource);

    console.log('Main seed completed successfully!');
  } catch (err) {
    console.error('Error during main seed:', err);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
};

main();
