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
import { Request } from 'express';

import { FinancialReportService } from './financial-report.service';
import { GetFinancialReportDto } from './dto/request.dto';
import { FinancialReportResponseDto } from './dto/response.dto';
import { ZodValidationPipe } from '../../../pipes/zod-validation.pipe';
import { financialReportValidationSchema } from './schema/financial-report.validation.schema';
import { ApiSuccess } from '../../../decorators/api-success.decorator';
import { BudgetCategory } from '../../../database/enums/budget-category.enum';

@ApiTags('Financial Reports')
@Controller('financial-reports')
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get financial report for a period' })
  @ApiSuccess(FinancialReportResponseDto)
  async getReport(
    @Query(new ZodValidationPipe(financialReportValidationSchema))
    dto: GetFinancialReportDto,
    @Req() req: Request,
  ): Promise<FinancialReportResponseDto> {
    const userId = (req.user as any)?.userId || 'temp-user-id';
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
    const userId = (req.user as any)?.userId || 'temp-user-id';
    return this.financialReportService.createInsight(userId, data);
  }

  @Patch('insights/:id/read')
  @ApiOperation({ summary: 'Mark an insight as read' })
  async markInsightAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any)?.userId || 'temp-user-id';
    return this.financialReportService.markInsightAsRead(id, userId);
  }
}
