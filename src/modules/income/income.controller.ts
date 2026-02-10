import { Body, Controller, Post, Req } from '@nestjs/common';
import { IncomeService } from './income.service';
import {
  CreateIncomeSwaggerDto,
  IncomeResponseSwaggerDto,
} from './dto/swagger.dto';
import { incomeValidationSchema } from './schema/income.schema';
import { JwtCookieGuard } from '../auth/guards/cookies.guard';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import type { Request } from 'express';

@ApiTags('Income')
@ApiBearerAuth()
@UseGuards(JwtCookieGuard)
@Controller('incomes')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @ApiOperation({ summary: 'Create income' })
  @ApiCreatedResponse({ type: IncomeResponseSwaggerDto })
  async create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(incomeValidationSchema))
    dto: CreateIncomeSwaggerDto,
  ) {
    const userId = req.user!.id;
    return this.incomeService.create(userId, dto);
  }
}
