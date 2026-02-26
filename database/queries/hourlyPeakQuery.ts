import { DataSource } from 'typeorm';
import { Expense } from 'database/entities/expense.entities';
import { THourlyPeak } from './types';

export const getHourlyPeakQuery = async (
  dataSource: DataSource,
): Promise<THourlyPeak> => {
  const rows = await dataSource
    .getRepository(Expense)
    .createQueryBuilder('e')
    .select('EXTRACT(HOUR FROM e.createdAt)', 'hour')
    .addSelect('COUNT(*)', 'count')
    .groupBy('hour')
    .orderBy('hour', 'ASC')
    .getRawMany<{ hour: string; count: string }>();

  return rows.map((r) => ({
    hour: Number(r.hour),
    count: Number(r.count),
  }));
};
