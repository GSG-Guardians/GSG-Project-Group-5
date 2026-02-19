import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryName } from '../../../../database/enums';
import { type ChatRequestDto } from './request.dto';
import {
  type BudgetSuggestionItem,
  type BudgetSuggestionResponseDto,
  type ChatResponseDto,
  type BudgetSuggestionTuple,
} from './response.dto';

export class ChatRequestSwaggerDto implements ChatRequestDto {
  @ApiProperty({ example: 'Hello, AI!' })
  message: string;

  @ApiPropertyOptional({ example: 'chat-uuid-123' })
  chatId?: string;
}

export class ChatResponseSwaggerDto implements ChatResponseDto {
  @ApiProperty({ example: 'I suggest you save more on Entertainment.' })
  response: string;

  @ApiProperty({ example: 'chat-uuid-123' })
  chatId: string;
}

export class BudgetSuggestionItemSwaggerDto implements BudgetSuggestionItem {
  @ApiProperty({ enum: CategoryName, example: CategoryName.FOOD })
  category: CategoryName;

  @ApiProperty({ example: 500 })
  amount: number;

  @ApiProperty({ example: 25 })
  percentage: number;
}

export class BudgetSuggestionResponseSwaggerDto implements BudgetSuggestionResponseDto {
  @ApiProperty({
    type: [BudgetSuggestionItemSwaggerDto],
    description:
      'The AI suggested budget distribution. It will always return suggestions for these 3 specific categories: HOUSING, TRANSPORT, and HEALTH.',
    example: [
      { category: CategoryName.HOUSING, amount: 500, percentage: 50 },
      { category: CategoryName.TRANSPORT, amount: 300, percentage: 30 },
      { category: CategoryName.HEALTH, amount: 200, percentage: 20 },
    ],
  })
  data: BudgetSuggestionTuple;
}
