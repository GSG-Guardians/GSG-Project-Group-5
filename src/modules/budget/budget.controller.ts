import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtCookieGuard } from '../auth/guards/cookies.guard';

import { BudgetService } from './budget.service';
import type {
  CreateBudgetDto,
  UpdateBudgetDto,
  FilterBudgetDto,
} from './dto/request.dto';
import {
  CreateBudgetRequestSwaggerDto,
  UpdateBudgetRequestSwaggerDto,
  BudgetResponseSwaggerDto,
} from './dto/swagger.dto';
import {
  budgetValidationSchema,
  updateBudgetValidationSchema,
} from './schema/budget.schema';

import {
  ApiSuccess,
  ApiSuccessPaginated,
} from '../../helpers/swaggerDTOWrapper.helpers';
import type { IPaginationQuery } from '../../types/pagination.types';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';

@ApiTags('Budgets')
@ApiBearerAuth()
@Controller('budgets')
@UseGuards(JwtCookieGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiBody({ type: CreateBudgetRequestSwaggerDto })
  @ApiSuccess(BudgetResponseSwaggerDto)
  create(
    @Body(new ZodValidationPipe(budgetValidationSchema)) body: CreateBudgetDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.budgetService.create(userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets with pagination and filtering' })
  @ApiSuccessPaginated(BudgetResponseSwaggerDto)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: [
      'FOOD',
      'TRANSPORT',
      'ENTERTAINMENT',
      'HEALTH',
      'SHOPPING',
      'OTHERS',
    ],
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  findAll(
    @Query() query: IPaginationQuery,
    @Query() filter: FilterBudgetDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.budgetService.findAll(userId, query, filter);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get budget summary statistics' })
  @ApiSuccess(Object)
  getBudgetSummary(@Req() req: Request) {
    const userId = req.user!.id;
    return this.budgetService.getBudgetSummary(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific budget by ID' })
  @ApiSuccess(BudgetResponseSwaggerDto)
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return this.budgetService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a budget' })
  @ApiBody({ type: UpdateBudgetRequestSwaggerDto })
  @ApiSuccess(BudgetResponseSwaggerDto)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBudgetValidationSchema))
    body: UpdateBudgetDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.budgetService.update(id, userId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget' })
  @ApiSuccess(Object)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return this.budgetService.remove(id, userId);
  }
}
