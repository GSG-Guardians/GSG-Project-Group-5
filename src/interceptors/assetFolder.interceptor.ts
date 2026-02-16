import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import type { Request } from 'express';
import { AssetOwnerType } from 'database/enums';

type FolderArg = keyof typeof AssetOwnerType;

export function FolderInterceptor(folder: FolderArg): Type<NestInterceptor> {
  @Injectable()
  class FolderInterceptorMixin implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
      const req = context.switchToHttp().getRequest<Request>();
        
      req.folderName = folder;

      return next.handle();
    }
  }

  return mixin(FolderInterceptorMixin);
}
