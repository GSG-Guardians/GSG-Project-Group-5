import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Asset } from '../../../database/entities/assets.entities';
import { AssetOwnerType } from '../../../database/enums';
import { imageKitToken } from './providers/imageKit.provider';
import ImageKit, { toFile } from '@imagekit/nodejs';
import { StorageEngine } from 'multer';
import { SideEffectQueue } from '../../utils/side-effects';

@Injectable()
export class AssetsService {
  constructor(
    @Inject(imageKitToken) private imagekit: ImageKit,
    @InjectRepository(Asset)
    private readonly assetsRepository: Repository<Asset>,
  ) {}

  imageKitMulterStorage() {
    const imageKitStorage: StorageEngine = {
      _handleFile: (req, file, cb) => {
        toFile(file.stream)
          .then((fileData) =>
            this.imagekit.files
              .upload({
                file: fileData,
                fileName: file.originalname,
                folder: req.folderName!,
                useUniqueFileName: true,
              })
              .then((res) => {
                cb(null, res);
              }),
          )
          .catch(cb);
      },
      _removeFile: (req, file, cb) => {
        if (!file.fileId) return cb(null);
        console.log('_removeFile of custom multer imagekit storage triggered ');
        this.imagekit.files
          .delete(file.fileId)
          .then(() => cb(null))
          .catch(cb);
      },
    };
    return imageKitStorage;
  }

  createFileAssetData(
    file: Express.Multer.File,
    userId: string,
    ownerType?: AssetOwnerType,
    ownerId?: string,
  ): DeepPartial<Asset> {
    return {
      userId,
      url: file.url,
      fileId: file.fileId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: String(file.size),
      ownerType: ownerType,
      ownerId: ownerId,
    };
  }

  async deleteAsset(
    tx: EntityManager,
    userId: string,
    sideEffects: SideEffectQueue,
    ownerType?: AssetOwnerType,
    ownerId?: string,
  ) {
    const where: FindOptionsWhere<Asset> = {
      userId,
    };
    if (ownerType) where.ownerType = ownerType;
    if (ownerId) where.ownerId = ownerId;

    const existingAssets = await tx.find(Asset, {
      where,
    });

    if (existingAssets.length > 0) {
      await tx.remove(existingAssets);

      existingAssets.forEach((asset) => {
        if (asset.fileId) {
          sideEffects.add('delete imagekit file', async () => {
            await this.imagekit.files.delete(asset.fileId);
          });
        }
      });
    }
    await sideEffects.runAll();
    return existingAssets;
  }
}
