import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UploadToAwsProvider } from './uplode-to-aws.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from '../entities/upload.entity';
import { ConfigService } from '@nestjs/config';
import { fileTypesEnum } from '../enums/file-type.enum';
import { User } from 'src/interfaces/user.interface';
import { Attachments, AttachmentTypeEnum } from '../entities/attachment.entity';
import { UploadFileDto } from '../Dto/upload-file.dto';
import { UploadFileTypeDto } from '../Dto/upload-type.dto';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepo: Repository<Upload>,
    @InjectRepository(Attachments)
    private readonly attachmentRepo: Repository<Attachments>,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    private readonly configService: ConfigService,
  ) {}
  public async uploadFile(
    file: Express.Multer.File,
    user: User,
    type: AttachmentTypeEnum,
  ) {
    // throw error for unsupported MIME types
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Mime type not supported');
    }

    let upload;
    try {
      const name = await this.uploadToAwsProvider.uploadFile(file);
      const uploadFile = {
        name: name,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        type: fileTypesEnum.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      upload = await this.uploadRepo.create(uploadFile);
      upload = await this.uploadRepo.save(upload);
      await this.saveAttachment(upload, user, type);
    } catch (error) {
      throw new ConflictException(error);
    }
    return upload;
  }

  public async uploadFileGeneral(file: Express.Multer.File) {
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Mime type not supported');
    }

    let upload;
    try {
      const name = await this.uploadToAwsProvider.uploadFile(file);
      const uploadFile = {
        name: name,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        type: fileTypesEnum.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      upload = await this.uploadRepo.create(uploadFile);
      upload = await this.uploadRepo.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
    return upload;
  }

  private async saveAttachment(
    upload: Upload,
    user: User,
    type: AttachmentTypeEnum,
  ) {
    const attachment = this.attachmentRepo.create({
      user_id: user.id,
      upload: { id: upload.id },
      type: type,
    });
    await this.attachmentRepo.save(attachment);
  }

  async getFile(user: User, type?: AttachmentTypeEnum) {
    let typeO = {};
    if (type) {
      typeO['type'] = type;
      const attachments = await this.attachmentRepo.find({
        where: { user_id: user.id, ...typeO },
        relations: ['upload'],
        order: { createdAt: 'DESC' },
      });
      if (!attachments || attachments.length === 0) {
        return [];
      }
      return attachments;
    }
    const attachments = await this.attachmentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.upload', 'upload')
      .where('a.user_id = :userId', { userId: user.id })
      .distinctOn(['a.type'])
      .orderBy('a.type', 'ASC')
      .addOrderBy('a.createdAt', 'DESC')
      .getMany();

    if (!attachments || attachments.length === 0) {
      throw new NotFoundException('File not found');
    }

    return attachments;
  }

  async getFileByUserId(user_id: string, type?: AttachmentTypeEnum) {
    let typeO = {};
    if (type) {
      typeO['type'] = type;
      const attachments = await this.attachmentRepo.find({
        where: { user_id: user_id, ...typeO },
        relations: ['upload'],
        order: { createdAt: 'DESC' },
      });
      if (!attachments || attachments.length === 0) {
        return [];
      }
      return attachments;
    }
    const attachments = await this.attachmentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.upload', 'upload')
      .where('a.user_id = :userId', { userId: user_id })
      .distinctOn(['a.type'])
      .orderBy('a.type', 'ASC')
      .addOrderBy('a.createdAt', 'DESC')
      .getMany();

    if (!attachments || attachments.length === 0) {
      throw new NotFoundException('File not found');
    }

    return attachments;
  }
}
