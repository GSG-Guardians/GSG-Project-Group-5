import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AttachmentTypeEnum } from '../entities/attachment.entity';

export class UploadFileTypeDto {
  @ApiProperty({
    description: 'Document type',
    enum: AttachmentTypeEnum,
  })
  @IsEnum(AttachmentTypeEnum)
  @IsOptional()
  type?: AttachmentTypeEnum;
}
