import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { FinancialReportService } from './financial-report.service';
import type { GetFinancialReportDto } from './dto/request.dto';
import { FinancialReportResponseSwaggerDto } from './dto/swagger.dto';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
import { getFinancialReportValidationSchema } from './schema/financial-report.schema';
import { ApiSuccess } from '../../helpers/swaggerDTOWrapper.helpers';
import { BudgetCategory } from '../../../database/enums';

@ApiTags('Financial Reports')
@Controller('financial-reports')
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get financial report for a period' })
  @ApiSuccess(FinancialReportResponseSwaggerDto)
  async getReport(
    @Query(new ZodValidationPipe(getFinancialReportValidationSchema))
    dto: GetFinancialReportDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.financialReportService.getFinancialReport(userId, dto);
  }

  @Post('insights')
  @ApiOperation({ summary: 'Create a financial insight' })
  async createInsight(
    @Body()
    data: {
      insightType: string;
      title: string;
      message: string;
      category?: BudgetCategory;
      period?: string;
    },
    @Req() req: Request,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.financialReportService.createInsight(userId, data);
  }

  @Patch('insights/:id/read')
  @ApiOperation({ summary: 'Mark an insight as read' })
  async markInsightAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.id || 'temp-user-id';
    return this.financialReportService.markInsightAsRead(id, userId);
  }
}
