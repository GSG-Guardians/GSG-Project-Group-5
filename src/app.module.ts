import jwtConfig from './config/jwt.config';
import { TokenGuard } from './guards/token.guard';
import databaseConfig from './config/database.config';
import { UploadsModule } from './uploads/uploads.module';
import appConfig from './config/app.config';
import { UserModule } from './modules/user.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DateInterceptor } from './interceptor/date.interceptor';

const ENV = process.env.NODE_ENV;

@Global()
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [jwtConfig, databaseConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        port: +configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        database: configService.get('database.name'),
        ssl: false,
      }),
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: TokenGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: DateInterceptor,
    },
  ],
  exports: [],
})
export class AppModule {}
