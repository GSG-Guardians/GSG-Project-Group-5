import { Body, Controller, Post, Get, Req, UsePipes } from '@nestjs/common';
import { AiService } from './ai.service';
import { type ChatRequestDto } from './dto/request.dto';
import {
  ChatRequestSwaggerDto,
  ChatResponseSwaggerDto,
  BudgetSuggestionResponseSwaggerDto,
} from './dto/swagger.dto';
import { type Request } from 'express';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ApiSuccess } from '../../helpers/swaggerDTOWrapper.helpers';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
import { ChatRequestSchema } from './schemas/ai.schema';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI financial advisor' })
  @ApiBearerAuth()
  @ApiBody({ type: ChatRequestSwaggerDto })
  @ApiSuccess(ChatResponseSwaggerDto)
  @UsePipes(new ZodValidationPipe(ChatRequestSchema))
  async chatWithAi(@Body() message: ChatRequestDto, @Req() req: Request) {
    return this.aiService.chatWithAi(message, req.user!);
  }

  @Get('suggest-budget')
  @ApiOperation({ summary: 'Get a recommended budget distribution' })
  @ApiBearerAuth()
  @ApiSuccess(BudgetSuggestionResponseSwaggerDto)
  async getSuggestedBudget(@Req() req: Request) {
    return this.aiService.getSuggestedBudget(req.user!);
  }
}
