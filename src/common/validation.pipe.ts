import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as Ajv from 'ajv';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(
    private readonly schema: any,
  ) {
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const ajv = new Ajv();
    const valid = ajv.validate(this.schema, value);
    if (!valid) {
      throw new BadRequestException(ajv.errors);
    }
    return value;
  }
}
