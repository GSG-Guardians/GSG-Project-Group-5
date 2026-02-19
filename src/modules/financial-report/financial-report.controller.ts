import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';

import { FinancialReportService } from './financial-report.service';
import {
  FinancialReportResponseSwaggerDto,
  FinancialInsightResponseSwaggerDto,
} from './dto/swagger.dto';
import { ApiSuccess } from '../../helpers/swaggerDTOWrapper.helpers';

@ApiTags('Financial Reports')
@ApiBearerAuth()
@Controller('financial-reports')
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get financial report for the last month' })
  @ApiBearerAuth()
  @ApiSuccess(FinancialReportResponseSwaggerDto)
  async getReport(@Req() req: Request) {
    const userId = req.user!.id;
    return this.financialReportService.getFinancialReport(userId);
  }

  @Post('insights')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a financial insight' })
  @ApiSuccess(FinancialInsightResponseSwaggerDto)
  async createInsight(
    @Body()
    data: {
      insightType: string;
      title: string;
      message: string;
      periodStart: Date;
      periodEnd: Date;
    },
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return this.financialReportService.createInsight(userId, data);
  }

  @Patch('insights/:id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark an insight as read' })
  @ApiSuccess(FinancialInsightResponseSwaggerDto)
  async markInsightAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return this.financialReportService.markInsightAsRead(id, userId);
  }
}
