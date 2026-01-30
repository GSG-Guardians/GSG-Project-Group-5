/* eslint-disable prettier/prettier */
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BillsService } from './bills.service';
import { CreateBillDto, UpdateBillDto, UpdateBillStatusDto } from './dto';

type UploadedFilePayload = {
    originalname: string;
    mimetype: string;
    size: number;
    buffer?: Buffer;
};

@Controller('v1/bills')
export class BillsController {
    constructor(private readonly billsService: BillsService) { }

    @Get()
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
    async getBill(@Param('id') id: string) {
        return this.billsService.getBillDetails(id);
    }

    @Post()
    async createBill(@Body() dto: CreateBillDto) {
        return this.billsService.createBill(dto);
    }

    @Put(':id')
    async updateBill(@Param('id') id: string, @Body() dto: UpdateBillDto) {
        return this.billsService.updateBill(id, dto);
    }

    @Delete(':id')
    async deleteBill(@Param('id') id: string) {
        return this.billsService.deleteBill(id);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateBillStatusDto,
    ) {
        return this.billsService.updateBillStatus(id, dto.status);
    }

    @Post('smart-parse')
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
        const dateMatch = text.match(
            /(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/,
        );
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
