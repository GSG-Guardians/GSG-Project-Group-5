import { Injectable } from '@nestjs/common';
import { ChatRequestDto } from './dto/request.dto';
import { BillsService } from '../bills/bills.service';
import { ExpensesService } from '../expenses/expenses.service';
import { BudgetService } from '../budget/budget.service';
import { UserResponseDto } from '../user/dto';
import { DebtService } from '../debt/debt.service';
import { IncomeService } from '../income/income.service';
import { TChatMessage, TGroqPromptInput } from './ai.types';
import { Chat } from '../../../database/entities/chat.entities';
import { ChatService } from '../chat/chat.service';
import { ChatRole } from '../../../database/enums';
import {
  buildGroqFinanceFullPrompt,
  buildGroqBudgetSuggestionPrompt,
  cleanAiResponse,
} from './ai.utils';
import Groq from 'groq-sdk';
import { BudgetSuggestionResponseDto } from './dto/response.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly billsService: BillsService,
    private readonly expensesService: ExpensesService,
    private readonly budgetsService: BudgetService,
    private readonly debtsService: DebtService,
    private readonly incomesService: IncomeService,
    private readonly chatService: ChatService,
  ) {}

  private groq = new Groq();

  async chatWithAi(message: ChatRequestDto, user: UserResponseDto) {
    const date = new Date();
    const incomeSummary = await this.incomesService.getMonthlyIncomeSummary(
      user.id,
      date,
    );
    const expenseSummary = await this.expensesService.getMonthlyExpenseSummary(
      user.id,
      date,
    );
    const debtSummary = await this.debtsService.getMonthlyDebtSummary(
      user.id,
      date,
    );
    const budgetSummary = await this.budgetsService.getMonthlyBudgetSummary(
      user.id,
      date,
    );
    const billSummary = await this.billsService.getMonthlySummary(
      user.id,
      date,
    );

    let chat: Chat;
    if (message.chatId) {
      chat = await this.chatService.getChatWithMessages(
        message.chatId,
        user.id,
      );
    } else {
      chat = await this.chatService.createChat(user.id);
    }

    // Save user message
    await this.chatService.createMessage(
      chat.id,
      ChatRole.USER,
      message.message,
    );

    const promptInput: TGroqPromptInput = {
      username: user.fullName,
      monthlyBudgetSummary: budgetSummary,
      monthlyBillSummary: billSummary,
      monthlyDebtSummary: debtSummary,
      monthlyExpenseSummary: expenseSummary,
      monthlyIncomeSummary: incomeSummary,
      userMessage: message.message,
    };

    if (chat.messages && chat.messages.length > 0) {
      promptInput.previousMessages = this.toChatMessages(chat);
    }

    const promptToSend = buildGroqFinanceFullPrompt(promptInput);

    const aiResponseContent = await this.callGroqApi(promptToSend);

    await this.chatService.createMessage(
      chat.id,
      ChatRole.AGENT,
      aiResponseContent,
    );

    return {
      chatId: chat.id,
      message: aiResponseContent,
    };
  }

  async getSuggestedBudget(
    user: UserResponseDto,
  ): Promise<BudgetSuggestionResponseDto> {
    const date = new Date();
    const incomeSummary = await this.incomesService.getMonthlyIncomeSummary(
      user.id,
      date,
    );
    const expenseSummary = await this.expensesService.getMonthlyExpenseSummary(
      user.id,
      date,
    );
    const debtSummary = await this.debtsService.getMonthlyDebtSummary(
      user.id,
      date,
    );
    const budgetSummary = await this.budgetsService.getMonthlyBudgetSummary(
      user.id,
      date,
    );
    const billSummary = await this.billsService.getMonthlySummary(
      user.id,
      date,
    );

    const promptInput: TGroqPromptInput = {
      username: user.fullName,
      monthlyBudgetSummary: budgetSummary,
      monthlyBillSummary: billSummary,
      monthlyDebtSummary: debtSummary,
      monthlyExpenseSummary: expenseSummary,
      monthlyIncomeSummary: incomeSummary,
      userMessage: 'Give me a budget suggestion',
    };
    const prompt = buildGroqBudgetSuggestionPrompt(promptInput);
    const aiResponse = await this.callGroqApi(prompt);
    const cleanedResponse = cleanAiResponse(aiResponse);
    const parsed = JSON.parse(cleanedResponse) as BudgetSuggestionResponseDto;
    return parsed;
  }

  private async callGroqApi(prompt: string) {
    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return completion.choices[0]?.message?.content || '';
  }

  private toChatMessages(chat: Chat): TChatMessage[] {
    if (!chat || !chat.messages) return [];
    return chat.messages.map((msg) => ({
      source: msg.role,
      content: msg.content,
    }));
  }
}
