import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private schema: ZodType<T>) {}

  transform(value: unknown) {
    const parsedValue = this.schema.parse(value);
    return parsedValue;
  }
}
