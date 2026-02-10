import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BillsService } from './bills.service';
import {
  CreateBillSwaggerDto,
  UpdateBillSwaggerDto,
  UpdateBillStatusSwaggerDto,
  SmartParseResponseSwaggerDto,
  BillResponseSwaggerDto,
  BillListResponseSwaggerDto,
  type TCreateBillRequest,
  type TUpdateBillRequest,
  type TUpdateBillStatusRequest,
} from './dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import {
  CreateBillSchema,
  UpdateBillSchema,
  UpdateBillStatusSchema,
} from './schemas/bills.schema';
import { ApiBody } from '@nestjs/swagger';
import { ApiSuccess } from 'src/helpers/swaggerDTOWrapper.helpers';
import { type Request } from 'express';

type UploadedFilePayload = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
};

@ApiTags('Bills')
@ApiBearerAuth()
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) { }

  @Get()
  @ApiOperation({
    summary: 'List bills',
    description:
      'Fetches the list of bills with optional filtering and pagination',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['individual', 'group'],
    description: 'Filter by bill type',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiSuccess(BillListResponseSwaggerDto)
  async listBills(
    @Query('type') type?: 'individual' | 'group',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.billsService.listBills({
      type,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get bill details',
    description:
      'Retrieves full details of a specific bill, including participants for group bills',
  })
  @ApiParam({ name: 'id', description: 'Bill ID' })
  @ApiSuccess(BillResponseSwaggerDto)
  async getBill(@Param('id') id: string) {
    return this.billsService.getBillDetails(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new bill',
    description: 'Create a new bill record (individual or group)',
  })
  @ApiBody({ type: CreateBillSwaggerDto })
  @ApiSuccess(BillResponseSwaggerDto)
  async createBill(
    @Body(new ZodValidationPipe(CreateBillSchema)) dto: TCreateBillRequest,
    @Req() req: Request,
  ) {
    return this.billsService.createBill(req.user!.id, dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update bill',
    description: 'Update bill name, amount, or settings',
  })
  @ApiParam({ name: 'id', description: 'Bill ID' })
  @ApiBody({ type: UpdateBillSwaggerDto })
  @ApiSuccess(BillResponseSwaggerDto)
  async updateBill(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateBillSchema)) dto: TUpdateBillRequest,
  ) {
    return this.billsService.updateBill(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bill', description: 'Delete a bill record' })
  @ApiParam({ name: 'id', description: 'Bill ID' })
  @ApiResponse({ status: 200, description: 'Bill deleted successfully' })
  async deleteBill(@Param('id') id: string) {
    return this.billsService.deleteBill(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update payment status',
    description: 'Update payment status (paid/unpaid)',
  })
  @ApiParam({ name: 'id', description: 'Bill ID' })
  @ApiBody({ type: UpdateBillStatusSwaggerDto })
  @ApiSuccess(BillResponseSwaggerDto)
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateBillStatusSchema))
    dto: TUpdateBillStatusRequest,
  ) {
    return this.billsService.updateBillStatus(id, dto.status);
  }

  @Post('smart-parse')
  @ApiOperation({
    summary: 'Smart Bill Parser (AI)',
    description: 'Auto-fills form from image, PDF, or text',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: SmartParseResponseSwaggerDto })
  @UseInterceptors(FileInterceptor('file'))
  smartParse(
    @UploadedFile() file?: UploadedFilePayload,
    @Body('text') text?: string,
  ) {
    if (file) {
      return {
        source: 'file',
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        parsed: this.basicParseFromText(file.buffer?.toString('utf8')),
      };
    }

    return {
      source: 'text',
      parsed: this.basicParseFromText(text),
    };
  }

  private basicParseFromText(text?: string) {
    if (!text) {
      return { name: null, amount: null, date: null, type: null };
    }

    const amountMatch = text.match(/(\d+(?:\.\d{1,2})?)/);
    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/);
    const name =
      text.split('\n').find((line) => line.trim().length > 3) ?? null;

    return {
      name: name ? name.trim() : null,
      amount: amountMatch ? Number(amountMatch[1]) : null,
      date: dateMatch ? dateMatch[0] : null,
      type: null,
    };
  }
}
