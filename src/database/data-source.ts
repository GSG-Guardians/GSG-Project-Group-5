import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = {
  useFactory: (configService: ConfigService) =>
    new DataSource({
      type: 'postgres',
      url: configService.getOrThrow<string>('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
      entities: [join(__dirname, 'entities', '*.entities.{ts,js}')],
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      synchronize: false,
      migrationsRun: false,
      logging: ['schema', 'error', 'warn', 'info'],
    }),
  inject: [ConfigService],
};
