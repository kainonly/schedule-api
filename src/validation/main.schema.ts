import * as Joi from 'joi';

export class MainSchema {
  static get = {
    id: Joi.number(),
  };

}
