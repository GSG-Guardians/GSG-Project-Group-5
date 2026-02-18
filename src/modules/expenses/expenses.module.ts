import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../../../database/entities/expense.entities';
import { Income } from '../../../database/entities/income.entities';
import { User } from '../../../database/entities/user.entities';
import { ExpensesController } from './expenses.controller';
import { CategoriesController } from './categories.controller';
import { ExpensesService } from './expenses.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Income, User]), UserModule],
  controllers: [ExpensesController, CategoriesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
