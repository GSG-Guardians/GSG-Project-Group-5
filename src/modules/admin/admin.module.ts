import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { DebtModule } from '../debt/debt.module';
import { BillsModule } from '../bills/bills.module';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [UserModule, DebtModule, BillsModule, ExpensesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
