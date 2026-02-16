import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from 'database/entities/assets.entities';
import { MulterModule } from '@nestjs/platform-express';
import { ImageKitProvider } from './providers/imageKit.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    MulterModule.registerAsync({
      imports: [AssetsModule],
      useFactory: (fileService: AssetsService) => {
        return {
          storage: fileService.imageKitMulterStorage(),
          limits: {
            fileSize: 2 * 1024 * 1024,
          },
          fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
              return cb(new Error('Only image files are allowed'), false);
            }
            cb(null, true);
          },
        };
      },
      inject: [AssetsService],
    }),
  ],
  providers: [AssetsService, ImageKitProvider],
  exports: [AssetsService, MulterModule],
})
export class AssetsModule {}
