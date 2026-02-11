import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { JwtCookieGuard } from '../auth/guards/cookies.guard';
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
  type TExpenseTotalsQuery,
  type TExpenseDonutQuery,
} from './dto/request.dto';
import {
  CreateExpenseSchema,
  ExpenseTotalsQuerySchema,
  ExpenseDonutQuerySchema,
} from './schema/expenses.schema';
import {
  ApiSuccess,
  ApiSuccessArray,
} from 'src/helpers/swaggerDTOWrapper.helpers';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('expenses')
@UseGuards(JwtCookieGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Expenses overview' })
  @ApiSuccess(ExpenseOverviewResponseSwaggerDto)
  @ApiQuery({ name: 'currencyId', required: false, type: String })
  getOverview(
    @Req() req: Request,
    @Query(new ZodValidationPipe(ExpenseTotalsQuerySchema))
    query: TExpenseTotalsQuery,
  ) {
    return this.expensesService.getOverview(req.user!, query);
  }

  @Get('categories/breakdown')
  @ApiOperation({ summary: 'Expenses categories breakdown' })
  @ApiSuccessArray(ExpenseCategoryBreakdownSwaggerDto)
  @ApiQuery({ name: 'currencyId', required: false, type: String })
  getCategoryBreakdown(
    @Req() req: Request,
    @Query(new ZodValidationPipe(ExpenseTotalsQuerySchema))
    query: TExpenseTotalsQuery,
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
    @Query(new ZodValidationPipe(ExpenseDonutQuerySchema))
    query: TExpenseDonutQuery,
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
