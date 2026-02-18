import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import {
  ApiSuccess,
  ApiSuccessPaginated,
} from '../../helpers/swaggerDTOWrapper.helpers';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
import type { IPaginationQuery } from '../../types/pagination.types';
import type { CreateIncomeDto, FilterIncomeDto, UpdateIncomeDto } from './dto';
import {
  CreateIncomeRequestSwaggerDto,
  IncomeResponseSwaggerDto,
  IncomeSummaryResponseSwaggerDto,
  UpdateIncomeRequestSwaggerDto,
} from './dto';
import { IncomeService } from './income.service';
import {
  incomeValidationSchema,
  updateIncomeValidationSchema,
} from './schema/income.schema';

@ApiTags('Incomes')
@ApiBearerAuth()
@Controller('incomes')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new income' })
  @ApiBody({ type: CreateIncomeRequestSwaggerDto })
  @ApiSuccess(IncomeResponseSwaggerDto)
  async create(
    @Body(new ZodValidationPipe(incomeValidationSchema)) dto: CreateIncomeDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.incomeService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incomes with pagination' })
  @ApiSuccessPaginated(IncomeResponseSwaggerDto)
  async findAll(
    @Query() query: IPaginationQuery,
    @Query() filter: FilterIncomeDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.incomeService.findAll(userId, query, filter);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get income summary' })
  @ApiSuccess(IncomeSummaryResponseSwaggerDto)
  async getSummary(@Req() req: Request) {
    const userId = req.user!.id;
    return this.incomeService.getIncomeSummary(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an income by ID' })
  @ApiSuccess(IncomeResponseSwaggerDto)
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return this.incomeService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an income' })
  @ApiBody({ type: UpdateIncomeRequestSwaggerDto })
  @ApiSuccess(IncomeResponseSwaggerDto)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateIncomeValidationSchema))
    dto: UpdateIncomeDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.incomeService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an income' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return this.incomeService.remove(id, userId);
  }
}
