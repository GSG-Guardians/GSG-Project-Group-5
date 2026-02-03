import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import {
  MetaPaginationSwaggerDto,
  SuccessOneSwaggerDto,
  SuccessPaginatedSwaggerDto,
} from './baseSwaggerDTO.helpers';

export const ApiSuccess = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiExtraModels(SuccessOneSwaggerDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessOneSwaggerDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );

export const ApiSuccessArray = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiExtraModels(SuccessOneSwaggerDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessOneSwaggerDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );

export const ApiSuccessPaginated = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiExtraModels(SuccessPaginatedSwaggerDto, MetaPaginationSwaggerDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessPaginatedSwaggerDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: { $ref: getSchemaPath(MetaPaginationSwaggerDto) },
            },
          },
        ],
      },
    }),
  );
