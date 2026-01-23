import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { ApiErrorResponse } from "src/types/api";
import { Response } from "express";
import { EntityMetadataNotFoundError, QueryFailedError, CustomRepositoryNotFoundError } from "typeorm";
import { buildApiErrorResponse } from "./exception.utils";
import { TPostgresDriverError } from "./exception.types";
import { parseUniqueDetail } from "./exception.utils";

@Catch(QueryFailedError, EntityMetadataNotFoundError, CustomRepositoryNotFoundError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | QueryFailedError
      | EntityMetadataNotFoundError
      | CustomRepositoryNotFoundError,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const defaultError: ApiErrorResponse = buildApiErrorResponse({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: request.url,
      message: "Something went wrong!",
    });

    
    if (exception instanceof EntityMetadataNotFoundError) {
      defaultError.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      defaultError.message =
        "Entity metadata not found. Check autoLoadEntities / entities registration.";
      return response.status(defaultError.statusCode).json(defaultError);
    }

    if (exception instanceof CustomRepositoryNotFoundError) {
      defaultError.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      defaultError.message =
        "Repository not found. Check TypeOrmModule.forFeature([...]) in the module.";
      return response.status(defaultError.statusCode).json(defaultError);
    }

    
    if (exception instanceof QueryFailedError) {
      const driverErr = exception as unknown as TPostgresDriverError;

      
      switch (driverErr.code) {
        
        case "23505": {
          defaultError.statusCode = HttpStatus.CONFLICT;
          defaultError.message = "Unique constraint failed";

          
          const parsed = parseUniqueDetail(driverErr.detail);
          if (parsed?.field) {
            defaultError.message = `Unique constraint failed on field: ${parsed.field}`;
            defaultError.fields = [
              { field: parsed.field, message: parsed.message ?? "Already exists" },
            ];
          }
          break;
        }

        
        case "23503": {
          defaultError.statusCode = HttpStatus.CONFLICT;
          defaultError.message = "Invalid relation reference (foreign key violation)";
          break;
        }

        
        case "23502": {
          defaultError.statusCode = HttpStatus.BAD_REQUEST;
          defaultError.message = "Missing required field";
          if (driverErr.column) {
            defaultError.fields = [
              { field: driverErr.column, message: "This field is required" },
            ];
          }
          break;
        }

        
        case "22P02": {
          defaultError.statusCode = HttpStatus.BAD_REQUEST;
          defaultError.message = "Invalid input format";
          break;
        }

        
        case "42P01": {
          defaultError.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          defaultError.message =
            "Database table not found. Did you run migrations?";
          break;
        }

        // Column does not exist (Prisma P2022-ish)
        case "42703": {
          defaultError.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          defaultError.message =
            "Database column not found. Check migrations/schema.";
          break;
        }

        
        case "57P01": // admin_shutdown
        case "57P02": // crash_shutdown
        case "57P03": // cannot_connect_now
        case "08006": // connection_failure
        case "08001": // sqlclient_unable_to_establish_sqlconnection
        case "53300": // too_many_connections
        {
          defaultError.statusCode = HttpStatus.SERVICE_UNAVAILABLE;
          defaultError.message = "Database unavailable";
          break;
        }

        default: {
          defaultError.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          defaultError.message = "Database error";
          break;
        }
      }

      return response.status(defaultError.statusCode).json(defaultError);
    }

    return response.status(defaultError.statusCode).json(defaultError);
  }
  
}