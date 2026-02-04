import {
  Body,
  Controller,
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

import { FinancialReportService } from './financial-report.service';
import type { GetFinancialReportDto } from './dto/request.dto';
import {
  FinancialReportResponseSwaggerDto,
  FinancialInsightResponseSwaggerDto,
} from './dto/swagger.dto';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
import { getFinancialReportValidationSchema } from './schema/financial-report.schema';
import { ApiSuccess } from '../../helpers/swaggerDTOWrapper.helpers';

@ApiTags('Financial Reports')
@ApiBearerAuth()
@Controller('financial-reports')
@UseGuards(JwtCookieGuard)
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
    const userId = req.user!.id;
    return this.financialReportService.getFinancialReport(userId, dto);
  }

  @Post('insights')
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
  @ApiOperation({ summary: 'Mark an insight as read' })
  @ApiSuccess(FinancialInsightResponseSwaggerDto)
  async markInsightAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return this.financialReportService.markInsightAsRead(id, userId);
  }
}
