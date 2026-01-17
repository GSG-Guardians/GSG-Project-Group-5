import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptHashingProvider } from './providers/bcrypt.hashing.provider';
import { TokenGenerator } from './providers/token-generator.provider';
import { UserModule } from 'src/modules/user.module';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: configService.get('jwt.signOptions'),
      }),
      global: true,
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'HashingProvider', useClass: BcryptHashingProvider },
    { provide: 'TokenGenerator', useClass: TokenGenerator },
  ],
  exports: [
    AuthService,
    { provide: 'HashingProvider', useClass: BcryptHashingProvider },
    { provide: 'TokenGenerator', useClass: TokenGenerator },
  ],
})
export class AuthModule {}
