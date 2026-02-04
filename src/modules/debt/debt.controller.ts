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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtCookieGuard } from '../auth/guards/cookies.guard';

import { DebtService } from './debt.service';
import type {
  CreateDebtDto,
  UpdateDebtDto,
  FilterDebtDto,
} from './dto/request.dto';
import { DebtResponseSwaggerDto } from './dto/swagger.dto';
import {
  debtValidationSchema,
  updateDebtValidationSchema,
} from './schema/debt.schema';
import {
  ApiSuccess,
  ApiSuccessPaginated,
} from '../../helpers/swaggerDTOWrapper.helpers';
import type { IPaginationQuery } from '../../types/pagination.types';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';

@ApiTags('Debts')
@ApiBearerAuth()
@Controller('debts')
@UseGuards(JwtCookieGuard)
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new debt' })
  @ApiSuccess(DebtResponseSwaggerDto)
  async create(
    @Body(new ZodValidationPipe(debtValidationSchema)) dto: CreateDebtDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.debtService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all debts with pagination' })
  @ApiSuccessPaginated(DebtResponseSwaggerDto)
  async findAll(
    @Query() query: IPaginationQuery,
    @Query() filter: FilterDebtDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.debtService.findAll(userId, query, filter);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get debt summary' })
  async getSummary(@Req() req: Request) {
    const userId = req.user!.id;
    return this.debtService.getDebtSummary(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a debt by ID' })
  @ApiSuccess(DebtResponseSwaggerDto)
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return this.debtService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a debt' })
  @ApiSuccess(DebtResponseSwaggerDto)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDebtValidationSchema)) dto: UpdateDebtDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.debtService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a debt' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return this.debtService.remove(id, userId);
  }
}
