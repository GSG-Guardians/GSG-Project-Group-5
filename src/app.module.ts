import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../database/data-source';
import { BillsModule } from './modules/bills/bills.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UnifiedResponseInterceptor } from './interceptors/unifiedResponse.interceptor';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    BillsModule,
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifiedResponseInterceptor,
    },
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
