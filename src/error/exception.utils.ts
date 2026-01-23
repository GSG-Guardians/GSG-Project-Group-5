import { ApiErrorResponse } from "src/types/api";

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