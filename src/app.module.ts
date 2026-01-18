import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return {
    type: "postgres",
    url: config.getOrThrow("DATABASE_URL"),
    autoLoadEntities: true,
    synchronize: false,
  }
  },
}),

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
