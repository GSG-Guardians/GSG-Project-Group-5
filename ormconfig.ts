import { DataSource } from 'typeorm';
import { config } from 'dotenv';

const ENV = process.env.NODE_ENV;
config({ path: !ENV ? '.env' : `.env.${ENV}` });

export default new DataSource({
  type: 'postgres',
  // host: process.env.DATABASE_HOST,
  // port: parseInt(process.env.DATABASE_PORT || '5432'),
  // username: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASSWORD,
  // database: process.env.DATABASE_NAME,
  // url: 'postgresql://postgres:vsggtmVBzvaKmCrgoFcOEjDIIGXVtVhx@interchange.proxy.rlwy.net:14023/railway',
  url: 'postgresql://neondb_owner:npg_Md3S2LyQTlcX@ep-summer-frog-aglwp7d8-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',

  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],

  synchronize: false,
});
