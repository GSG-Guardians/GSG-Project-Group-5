import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface ApiSuccessOptions {
  status?: number;
  isArray?: boolean;
}

export const ApiSuccess = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiSuccessOptions,
) => {
  const { status = 200, isArray = false } = options || {};

  return applyDecorators(
    ApiResponse({
      status,
      description: 'Success',
      schema: isArray
        ? {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  totalPages: { type: 'number' },
                  totalItems: { type: 'number' },
                },
              },
            },
          }
        : {
            type: 'object',
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
    }),
  );
};
