import * as Joi from 'joi';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidatePipe implements PipeTransform {
  constructor(
    private readonly schema: any,
  ) {
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = Joi.validate(value, this.schema);
    if (error) {
      throw new BadRequestException({
        error: 1,
        msg: error.message,
      });
    }
    return value;
  }
}
