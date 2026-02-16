import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import {
  CreateIncomeSwaggerDto,
  UpdateIncomeSwaggerDto,
  IncomeResponseSwaggerDto,
  IncomeSummarySwaggerDto,
  IncomeBreakdownSwaggerDto,
  IncomePeriodQuerySwaggerDto,
} from './dto/swagger.dto';
import {
  incomeValidationSchema,
  updateIncomeValidationSchema,
} from './schema/income.schema';
import { JwtCookieGuard } from '../auth/guards/cookies.guard';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
import type { Request } from 'express';
import { ApiSuccessPaginated } from '../../helpers/swaggerDTOWrapper.helpers';
import type { IPaginationQuery } from '../../types/pagination.types';
import type { FilterIncomeDto } from './dto/filter-income.dto';

@ApiTags('Income')
@ApiBearerAuth()
@UseGuards(JwtCookieGuard)
@Controller('incomes')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}
  // POST   /incomes
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

  // GET /incomes
  @Get()
  @ApiOperation({ summary: 'Get all incomes' })
  @ApiSuccessPaginated(IncomeResponseSwaggerDto)
  async findAll(
    @Query() query: IPaginationQuery,
    @Query() filter: FilterIncomeDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.incomeService.findAll(userId, query, filter);
  }
  // GET    /incomes/summary
  @Get('summary')
  @ApiOperation({ summary: 'Get income summary' })
  @ApiOkResponse({ type: IncomeSummarySwaggerDto })
  async getSummary(@Req() req: Request) {
    const userId = req.user!.id;
    return this.incomeService.getIncomeSummary(userId);
  }

  // GET /incomes/recent
  @Get('recent')
  @ApiOperation({ summary: 'Get recent incomes' })
  @ApiSuccessPaginated(IncomeResponseSwaggerDto)
  async getRecent(@Req() req: Request) {
    const userId = req.user!.id;
    return this.incomeService.getRecent(userId);
  }

  // GET/incomes/breakdown
  @Get('breakdown')
  @ApiOperation({ summary: 'Get income breakdown by source' })
  @ApiOkResponse({ type: IncomeBreakdownSwaggerDto })
  async breakdown(
    @Req() req: Request,
    @Query() query: IncomePeriodQuerySwaggerDto,
  ) {
    const userId = req.user!.id;
    return this.incomeService.getBreakdown(userId, query.period);
  }

  // GET /incomes/chart
  @Get('chart')
  @ApiOperation({ summary: 'Get income chart data' })
  @ApiOkResponse({
    schema: {
      example: [
        { label: '2026-02-01', total: 120 },
        { label: '2026-02-02', total: 80 },
      ],
    },
  })
  async chart(
    @Req() req: Request,
    @Query() query: IncomePeriodQuerySwaggerDto,
  ) {
    const userId = req.user!.id;
    return this.incomeService.getChart(userId, query.period);
  }

  // GET /incomes/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get income by id' })
  @ApiOkResponse({ type: IncomeResponseSwaggerDto })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user!.id;
    return this.incomeService.findOne(userId, id);
  }

  // PATCH /incomes/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Update income by id' })
  @ApiOkResponse({ type: IncomeResponseSwaggerDto })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateIncomeValidationSchema))
    dto: UpdateIncomeSwaggerDto,
  ) {
    const userId = req.user!.id;
    return this.incomeService.update(userId, id, dto);
  }

  // DELETE /incomes/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete income by id' })
  @ApiOkResponse({
    schema: {
      example: { success: true },
    },
  })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user!.id;
    return this.incomeService.remove(userId, id);
  }
}
