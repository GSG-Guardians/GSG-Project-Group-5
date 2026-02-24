import dataSource from 'database/data-source';
import { Income } from 'database/entities/income.entities';
import { FindOptionsWhere } from 'typeorm';

export const getTotalIncomes = async (
  where: FindOptionsWhere<Income>,
): Promise<number> => {
  const rows = await dataSource
    .getRepository(Income)
    .createQueryBuilder('i')
    .select('COALESCE(SUM(CAST(i.amount AS DECIMAL)), 0)', 'total')
    .where(where)
    .getRawOne();
  return parseFloat(rows?.total) || 0;
};
