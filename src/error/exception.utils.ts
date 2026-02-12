import { ApiErrorResponse } from 'src/types/api.types';
import { PostgresErrorCode } from './exception.constants';
import { HttpStatus } from '@nestjs/common';
import { $ZodIssue } from "zod/v4/core";

export function buildApiErrorResponse(args: {
  statusCode: number;
  path: string;
  message?: string;
}): ApiErrorResponse {
  const { statusCode, path, message } = args;

  return {
    timestamp: new Date().toISOString(),
    success: false,
    statusCode,
    path,
    message: message ?? 'Something went wrong!',
  };
}

export function parseUniqueDetail(detail?: string) {
  if (!detail) return null;

  const match = detail.match(/Key \((.+?)\)=\((.+?)\) already exists\./);
  if (!match) return null;

  const field = match[1];
  const value = match[2];

  return {
    field,
    message: `${field} already exists`,
    value,
  };
}

export const DB_ERROR_MAP: Record<
  string,
  { status: HttpStatus; message: string }
> = {
  [PostgresErrorCode.UNIQUE_VIOLATION]: {
    status: HttpStatus.CONFLICT,
    message: 'Resource already exists',
  },
  [PostgresErrorCode.FOREIGN_KEY_VIOLATION]: {
    status: HttpStatus.CONFLICT,
    message: 'Invalid relation reference',
  },
  [PostgresErrorCode.NOT_NULL_VIOLATION]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Missing required fields',
  },
  [PostgresErrorCode.INVALID_TEXT_REPRESENTATION]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid data format',
  },
  [PostgresErrorCode.CHECK_VIOLATION]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Validation rule failed',
  },
  [PostgresErrorCode.STRING_DATA_RIGHT_TRUNCATION]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Value is too long',
  },
  [PostgresErrorCode.DEADLOCK_DETECTED]: {
    status: HttpStatus.CONFLICT,
    message: 'Transaction conflict, please retry',
  },
};

export function buildZodValidationErrorResponse(
  url: string,
  status: number,
  issues: $ZodIssue[]
): ApiErrorResponse {
  return {
    timestamp: new Date().toISOString(),
    success: false,
    statusCode: status,
    path: url,
    message: 'Validation failed',
    fields: issues.map((iss) => ({
      field: iss.path.join('.'),
      message: iss.message, 
    })),
}
  }
