import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Bill } from '../../../database/entities/bills.entities';
import { GroupInvoice } from '../../../database/entities/group-invoice.entities';
import { GroupInvoiceShare } from '../../../database/entities/group-invoice-share.entities';
import { GroupInvoiceShareItem } from '../../../database/entities/group-invoice-share-item.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bill,
      GroupInvoice,
      GroupInvoiceShare,
      GroupInvoiceShareItem,
    ]),
  ],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}
