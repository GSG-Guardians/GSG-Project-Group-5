import ImageKit from '@imagekit/nodejs';
import { UserResponseDto } from '../modules/user/dto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      FRONTEND_URL: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_PRIVATE_KEY: string;
      IMAGEKIT_PRIVATE_KEY: string;
    }
    interface BigInt {
      toJSON(): string;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Multer {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      interface File extends ImageKit.Files.FileUploadResponse {}
    }
    interface Request {
      user?: UserResponseDto;
      folderName?: string;
      fileId?: string;
    }
  }
}
