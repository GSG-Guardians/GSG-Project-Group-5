import ImageKit from '@imagekit/nodejs';
import { ConfigService } from '@nestjs/config';

export const imageKitToken = 'ImageKitProvider';
export const ImageKitProvider = {
  provide: imageKitToken,
  useFactory: (configService: ConfigService) => {
    return new ImageKit({
      privateKey: configService.getOrThrow('IMAGEKIT_SECRET_KEY'),
    });
  },
  inject: [ConfigService],
};
