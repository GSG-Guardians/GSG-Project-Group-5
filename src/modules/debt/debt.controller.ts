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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { DebtService } from './debt.service';
import { CreateDebtDto, UpdateDebtDto, FilterDebtDto } from './dto/request.dto';
import { DebtResponseDto } from './dto/response.dto';
import { ZodValidationPipe } from '../../../pipes/zod-validation.pipe';
import { debtValidationSchema } from './schema/debt.validation.schema';
import {
  IPaginationQuery,
  IPaginationResult,
} from '../../types/pagination.types';
import { ApiSuccess } from '../../../decorators/api-success.decorator';

@ApiTags('Debts')
@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new debt' })
  @ApiSuccess(DebtResponseDto, { status: 201 })
  async create(
    @Body(new ZodValidationPipe(debtValidationSchema)) dto: CreateDebtDto,
    @Req() req: Request,
  ): Promise<DebtResponseDto> {
    const userId = (req.user as any)?.userId || 'temp-user-id';
    return this.debtService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all debts with pagination' })
  @ApiSuccess(DebtResponseDto, { isArray: true })
  async findAll(
    @Query() query: IPaginationQuery,
    @Query() filter: FilterDebtDto,
    @Req() req: Request,
  ): Promise<IPaginationResult<DebtResponseDto>> {
    const userId = (req.user as any)?.userId || 'temp-user-id';
    return this.debtService.findAll(userId, query, filter);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get debt summary' })
  async getSummary(@Req() req: Request) {
    const userId = (req.user as any)?.userId || 'temp-user-id';
    return this.debtService.getDebtSummary(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a debt by ID' })
  @ApiSuccess(DebtResponseDto)
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DebtResponseDto> {
    const userId = (req.user as any)?.userId || 'temp-user-id';
    return this.debtService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a debt' })
  @ApiSuccess(DebtResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDebtDto,
    @Req() req: Request,
  ): Promise<DebtResponseDto> {
    const userId = (req.user as any)?.userId || 'temp-user-id';
    return this.debtService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a debt' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any)?.userId || 'temp-user-id';
    return this.debtService.remove(id, userId);
  }
}
