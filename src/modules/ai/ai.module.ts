import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../../../database/entities/chat.entities';
import { Message } from '../../../database/entities/message.entities';
import { BillsModule } from '../bills/bills.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { BudgetModule } from '../budget/budget.module';
import { DebtModule } from '../debt/debt.module';
import { IncomeModule } from '../income/income.module';
import { ChatModule } from '../chat/chat.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message]),
    BillsModule,
    ExpensesModule,
    BudgetModule,
    DebtModule,
    IncomeModule,
    ChatModule,
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
