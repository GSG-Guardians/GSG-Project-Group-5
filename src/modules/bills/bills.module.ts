import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Bill } from '../../../database/entities/bills.entities';
import { GroupInvoice } from '../../../database/entities/group-invoice.entities';
import { GroupInvoiceShare } from '../../../database/entities/group-invoice-share.entities';
import { GroupInvoiceShareItem } from '../../../database/entities/group-invoice-share-item.entities';
import { AssetsModule } from '../assets/assets.module';
import { ImageKitProvider } from '../assets/providers/imageKit.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bill,
      GroupInvoice,
      GroupInvoiceShare,
      GroupInvoiceShareItem,
    ]),
    AssetsModule,
  ],
  controllers: [BillsController],
  providers: [BillsService, ImageKitProvider],
  exports: [BillsService],
})
export class BillsModule {}
