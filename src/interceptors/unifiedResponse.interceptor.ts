import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse } from '../types/api';
import { IMetaPagination, IPaginationResult } from '../types/pagination';

interface IGenericResponse<T> {
    message?: string;
    data: T;
}
@Injectable()
export class UnifiedResponseInterceptor<T>
    implements NestInterceptor<IPaginationResult<T>| IGenericResponse<T> | T, SuccessResponse<T>> {
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

                const res: SuccessResponse<T> = {
                    success: true,
                    data: data.data,
                };

                if(data.message){
                    res.message = data.message;
                }
                return res;
            }),
        );
    }

    private isPaginatedResponse(data: any): data is { data: T[]; meta: IMetaPagination } {
        return (
            data &&
            typeof data === 'object' &&
            Array.isArray(data.data) &&
            'meta' in data
        );
    }
}
