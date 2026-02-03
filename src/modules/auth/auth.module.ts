import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordResetService } from './password-reset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetCode } from 'database/entities/password-reset-code.entities';
import { User } from 'database/entities/user.entities';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, PasswordResetCode]),
    ConfigModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordResetService],
})
export class AuthModule {}
