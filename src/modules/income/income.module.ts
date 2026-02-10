import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from '../../../database/entities/income.entities';
import { User } from '../../../database/entities/user.entities';
import { JwtCookieGuard } from '../auth/guards/cookies.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Income, User]), UserModule],
  controllers: [],
  providers: [JwtCookieGuard],
})
export class IncomeModule {}
