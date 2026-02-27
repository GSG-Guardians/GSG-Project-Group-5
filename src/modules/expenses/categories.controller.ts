import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
import { ApiSuccessArray } from '../../helpers/swaggerDTOWrapper.helpers';
import { JwtCookieGuard } from '../auth/guards/cookies.guard';
import { ExpensesService } from './expenses.service';
import type { TExpenseCategoryQuery } from './dto/request.dto';
import { ExpenseCategoryOptionSwaggerDto } from './dto/swagger.dto';
import { ExpenseCategoryQuerySchema } from './schema/expenses.schema';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtCookieGuard)
export class CategoriesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'Expense categories' })
  @ApiSuccessArray(ExpenseCategoryOptionSwaggerDto)
  @ApiQuery({ name: 'type', required: false, enum: ['expense'] })
  @ApiQuery({ name: 'currencyId', required: false, type: String })
  getExpenseCategories(
    @Req() req: Request,
    @Query(new ZodValidationPipe(ExpenseCategoryQuerySchema))
    query: TExpenseCategoryQuery,
  ) {
    return this.expensesService.getExpenseCategories(req.user!, query);
  }
}
