import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiErrorResponse } from 'src/types/api';
import { Response } from 'express';
import {
  EntityMetadataNotFoundError,
  QueryFailedError,
  CustomRepositoryNotFoundError,
} from 'typeorm';
import { buildApiErrorResponse, parseUniqueDetail } from './exception.utils';
import { DB_ERROR_MAP } from './exception.utils';
import { PostgresErrorCode } from './exception.constants';

@Catch(
  QueryFailedError,
  EntityMetadataNotFoundError,
  CustomRepositoryNotFoundError,
)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('DatabaseException');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isDev = process.env.NODE_ENV === 'development';

    const defaultError: ApiErrorResponse = buildApiErrorResponse({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: request.url,
      message: 'Something went wrong!',
    });

    if (
      exception instanceof EntityMetadataNotFoundError ||
      exception instanceof CustomRepositoryNotFoundError
    ) {
      this.logger.error(`Configuration Error: ${exception.message}`);
      if (isDev) {
        defaultError.message = exception.message;
      }
    } else if (exception instanceof QueryFailedError) {
      const driverErr = exception.driverError || {};
      const code = driverErr.code;

      const mappedError = DB_ERROR_MAP[code];

      if (mappedError) {
        defaultError.statusCode = mappedError.status;
        defaultError.message = mappedError.message;
      }

      if (code === PostgresErrorCode.UNIQUE_VIOLATION) {
        const parsed = parseUniqueDetail(driverErr.detail);
        if (parsed) {
          defaultError.message = `Unique constraint failed on ${parsed.field}`;
          defaultError.fields = [
            { field: parsed.field, message: 'Already exists' },
          ];
        }
      } else if (
        code === PostgresErrorCode.NOT_NULL_VIOLATION &&
        driverErr.column
      ) {
        defaultError.fields = [
          { field: driverErr.column, message: 'Field is required' },
        ];
      }

      this.logger.warn(`QueryFailedError [${code}]: ${exception.message}`);
    }

    return response.status(defaultError.statusCode).json(defaultError);
  }
}
