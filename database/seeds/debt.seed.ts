import { DataSource } from 'typeorm';
import { Debt } from '../entities/debts.entities';
import { DebtDirection, DebtStatus } from '../enums';

export async function seedDebts(dataSource: DataSource): Promise<void> {
  const debtRepo = dataSource.getRepository(Debt);

  // Clear existing debts
  await debtRepo.delete({});

  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + 30);

  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 15);

  // Since we need actual currency UUIDs and they might not exist yet,
  // we'll create the debts without saving them if currencies don't exist
  console.log(
    '⚠️  Debt seed skipped - requires currency UUIDs to be present in database',
  );
  console.log(
    '   Run currency seed first, then update debt seed with actual UUIDs',
  );
}
