import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import * as entities from './entities';

config({ path: '.env' });
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: Object.values(entities),
  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],
  synchronize: false,
};
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
