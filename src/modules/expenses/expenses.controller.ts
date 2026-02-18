import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
import { ExpensesService } from './expenses.service';
import {
  CreateExpenseRequestSwaggerDto,
  ExpenseOverviewResponseSwaggerDto,
  ExpenseCategoryBreakdownSwaggerDto,
  ExpenseDonutSegmentSwaggerDto,
  ExpenseResponseSwaggerDto,
} from './dto/swagger.dto';
import {
  type TCreateExpenseRequest,
  type TExpensePeriodQuery,
} from './dto/request.dto';
import {
  CreateExpenseSchema,
  ExpensePeriodQuerySchema,
} from './schema/expenses.schema';
import {
  ApiSuccess,
  ApiSuccessArray,
} from '../../helpers/swaggerDTOWrapper.helpers';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Expenses overview' })
  @ApiSuccess(ExpenseOverviewResponseSwaggerDto)
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month', 'year'],
  })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'currencyId', required: false, type: String })
  getOverview(
    @Req() req: Request,
    @Query(new ZodValidationPipe(ExpensePeriodQuerySchema))
    query: TExpensePeriodQuery,
  ) {
    return this.expensesService.getOverview(req.user!, query);
  }

  @Get('categories/breakdown')
  @ApiOperation({ summary: 'Expenses categories breakdown' })
  @ApiSuccessArray(ExpenseCategoryBreakdownSwaggerDto)
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month', 'year'],
  })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'currencyId', required: false, type: String })
  getCategoryBreakdown(
    @Req() req: Request,
    @Query(new ZodValidationPipe(ExpensePeriodQuerySchema))
    query: TExpensePeriodQuery,
  ) {
    return this.expensesService.getCategoryBreakdown(req.user!, query);
  }

  @Get('charts/donut')
  @ApiOperation({ summary: 'Expenses donut chart' })
  @ApiSuccessArray(ExpenseDonutSegmentSwaggerDto)
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month', 'year'],
  })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'currencyId', required: false, type: String })
  getDonutChart(
    @Req() req: Request,
    @Query(new ZodValidationPipe(ExpensePeriodQuerySchema))
    query: TExpensePeriodQuery,
  ) {
    return this.expensesService.getDonutChart(req.user!, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create new expense' })
  @ApiBody({ type: CreateExpenseRequestSwaggerDto })
  @ApiSuccess(ExpenseResponseSwaggerDto)
  createExpense(
    @Req() req: Request,
    @Body(new ZodValidationPipe(CreateExpenseSchema))
    body: TCreateExpenseRequest,
  ) {
    return this.expensesService.createExpense(req.user!, body);
  }
}
