import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse, TReturnedResponse } from '../types/api.types';
import { IPaginationResult } from '../types/pagination.types';

interface IGenericResponse<T> {
  message?: string;
  data: T;
}
@Injectable()
export class UnifiedResponseInterceptor<T> implements NestInterceptor<
  IPaginationResult<T> | IGenericResponse<T> | T,
  SuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    
    return next.handle().pipe(
      map((data) => {
        if (this.isPaginatedResponse(data)) {
          const res: SuccessResponse<T> = {
            success: true,
            data: data.data,
            meta: data.meta,
          };
          return res;
        }

        if (this.isGenericResponse(data)) {
          const res: SuccessResponse<T> = {
            success: true,
            data: data.data,
          };

          if (data.message) {
            res.message = data.message;
          }
          return res;
        }

        const res: SuccessResponse<T> = {
          success: true,
          data: data,
        };
        return res;
      }),
    );
  }

  private isPaginatedResponse(
    data: TReturnedResponse<T>,
  ): data is IPaginationResult<T> {
    return data 
        && typeof data === 'object' 
        && 'data' in data 
        && Array.isArray(data.data) 
        && 'meta' in data;
  }

  private isGenericResponse(
    data: TReturnedResponse<T>,
  ): data is IGenericResponse<T> {
    return data 
        && typeof data === 'object' 
        && 'data' in data 
        && 'message' in data;
  }
}