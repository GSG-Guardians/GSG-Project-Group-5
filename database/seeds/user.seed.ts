import { DataSource } from 'typeorm';
import { User } from '../entities/user.entities';
import { Currency } from '../entities/currency.entities';
import { dataSourceOptions } from '../data-source';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';
import { UserRole, UserStatus } from '../enums';

export const seedUsers = async (providedDataSource?: DataSource) => {
  let dataSource = providedDataSource;
  let isLocalDataSource = false;

  if (!dataSource) {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();
    isLocalDataSource = true;
  }

  const userRepo = dataSource.getRepository(User);
  const currencyRepo = dataSource.getRepository(Currency);

  const currencies = await currencyRepo.find();
  if (currencies.length === 0) {
    console.error('No currencies found! Please run seed:currency first.');
    if (isLocalDataSource) await dataSource.destroy();
    if (process.env.NODE_ENV !== 'test') process.exit(1);
    return;
  }

  const hashedPassword = await argon.hash('123456');

  // Admin
  const adminEmail = 'admin@email.com';
  const existingAdmin = await userRepo.findOne({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = userRepo.create({
      fullName: 'Admin User',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      defaultCurrency: currencies[0], // Use first currency (likely USD)
      provider: 'LOCAL',
    });
    await userRepo.save(admin);
    console.log('Created admin user');
  } else {
    console.log('Admin user already exists');
  }

  // Owners (simulated as Admins since OWNER role doesn't exist)
  for (let i = 0; i < 3; i++) {
    const email = faker.internet.email();
    const owner = userRepo.create({
      fullName: faker.person.fullName(),
      email: email,
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      defaultCurrency: faker.helpers.arrayElement(currencies),
      provider: 'LOCAL',
    });
    await userRepo.save(owner);
    console.log(`Created owner (as Admin): ${email}`);
  }

  // Random Users
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const user = userRepo.create({
      fullName: faker.person.fullName(),
      email: email,
      passwordHash: hashedPassword,
      role: faker.helpers.arrayElement([UserRole.USER, UserRole.ADMIN]),
      status: UserStatus.ACTIVE,
      defaultCurrency: faker.helpers.arrayElement(currencies),
      provider: 'LOCAL',
    });
    await userRepo.save(user);
    console.log(`Created user: ${email}`);
  }

  if (isLocalDataSource) {
    await dataSource.destroy();
  }
  console.log('User seeding completed!');
};

if (require.main === module) {
  seedUsers().catch((err) => {
    console.error('Error seeding users:', err);
    process.exit(1);
  });
}
