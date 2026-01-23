import { HttpStatus } from "@nestjs/common";
import { IMetaPagination } from "./pagination";

export type SuccessResponse<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: true;
      data: T[];
      meta: IMetaPagination; 
      message?: string;
    };


export type ApiErrorResponse = {
  success: false;
  message: string;
  timestamp: string;
  statusCode: HttpStatus;
  path: string;
  fields?: { field: string; message: string }[];
};
