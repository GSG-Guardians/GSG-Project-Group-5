import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadToAwsProvider } from './providers/uplode-to-aws.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Attachments } from './entities/attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Upload, Attachments])],
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProvider],
  exports: [UploadsService],
})
export class UploadsModule {}
