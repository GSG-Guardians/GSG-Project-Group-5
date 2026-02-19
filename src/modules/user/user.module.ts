import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../../database/entities/user.entities';
import { Currency } from '../../../database/entities/currency.entities';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AssetsModule } from '../assets/assets.module';
import { ImageKitProvider } from '../assets/providers/imageKit.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Currency]),
    AssetsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, ImageKitProvider],
  exports: [UserService],
})
export class UserModule {}
