import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiErrorResponse } from 'src/types/api.types';
import { Response, Request } from 'express';
import {
  EntityMetadataNotFoundError,
  QueryFailedError,
  CustomRepositoryNotFoundError,
} from 'typeorm';
import {
  buildApiErrorResponse,
  buildZodValidationErrorResponse,
  parseUniqueDetail,
} from './exception.utils';
import { DB_ERROR_MAP } from './exception.utils';
import { PostgresErrorCode } from './exception.constants';
import { IPostgresDriverError } from './exception.types';
import { ZodError } from 'zod';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = buildApiErrorResponse({
      statusCode: status,
      path: request.url,
      message: exception.message || 'Something went wrong!',
    });
    response.status(status).json(errorResponse);
  }
}

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = HttpStatus.BAD_REQUEST;
    const errorResponse = buildZodValidationErrorResponse(
      req.url,
      status,
      exception.issues,
    );

    res.status(status).json(errorResponse);
  }
}

@Catch(
  QueryFailedError,
  EntityMetadataNotFoundError,
  CustomRepositoryNotFoundError,
)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('DatabaseException');

  catch(exception: unknown, host: ArgumentsHost) {
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
      const driverErr = exception.driverError as IPostgresDriverError;
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

@Catch()
export class UncaughtExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const res = ctx.getResponse<Response>();

    const req = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error
        ? exception.message
        : 'Internal Server Error, try again later!';

    const error = buildApiErrorResponse({
      statusCode: status,
      path: req.url,
      message,
    });

    res.status(status).json(error);
  }
}
