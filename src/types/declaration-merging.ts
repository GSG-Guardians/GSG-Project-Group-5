import { UserResponseDto } from 'src/modules/user/dto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      FRONTEND_URL: string;
    }
    interface BigInt {
      toJSON(): string;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserResponseDto;
    }
  }
}
