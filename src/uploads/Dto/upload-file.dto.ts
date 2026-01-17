import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AttachmentTypeEnum } from '../entities/attachment.entity';

export class UploadFileDto {
  @ApiProperty({
    description: 'Document type',
    enum: AttachmentTypeEnum,
  })
  @IsEnum(AttachmentTypeEnum)
  @IsNotEmpty()
  type: AttachmentTypeEnum;
}
