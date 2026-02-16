/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError, from, mergeMap } from 'rxjs';
import type { Request } from 'express';
import { imageKitToken } from '../modules/assets/providers/imageKit.provider';
import ImageKit from '@imagekit/nodejs';

@Injectable()
export class AssetCleanupInterceptor implements NestInterceptor {
  constructor(@Inject(imageKitToken) private imagekit: ImageKit) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const fileId = req.file?.fileId;

    return next.handle().pipe(
      catchError((err) => {
        if (fileId) {
          return from(this.imagekit.files.delete(fileId)).pipe(
            mergeMap(() => throwError(() => err)),
            catchError(() => throwError(() => err)),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
