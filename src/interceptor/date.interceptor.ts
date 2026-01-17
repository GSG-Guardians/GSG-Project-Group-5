import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromUtcToGaza } from 'src/utils/date.utils';

@Injectable()
export class DateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item && (item.createdAt || item.updatedAt)) {
              const createTime = fromUtcToGaza(item.createdAt as Date);
              const updateTime = fromUtcToGaza(item.updatedAt as Date);
              if (item.createdAt) {
                item.createdAt = createTime;
              }

              if (item.updatedAt) {
                item.updatedAt = updateTime;
              }
            }
          });
        } else if (data && (data.createdAt || data.updatedAt)) {
          const createTime = fromUtcToGaza(data.createdAt as Date);
          const updateTime = fromUtcToGaza(data.updatedAt as Date);

          if (data.createdAt) {
            data.createdAt = createTime;
          }

          if (data.updatedAt) {
            data.updatedAt = updateTime;
          }
        }

        return data;
      }),
    );
  }
}
