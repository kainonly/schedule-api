import * as Joi from 'joi';
import { string } from 'joi';

export class TaskValidate {
  static get = {
    id: Joi.number().required(),
  };

  static lists = {};

  static add = {
    job_name: Joi.string().required(),
    rule: Joi.string().required(),
    time_zone: string().required(),
  };

  static update = {
    id: Joi.number().required(),
    job_name: Joi.string(),
    rule: Joi.string(),
    time_zone: string(),
  };

  static delete = {
    id: Joi.number().required(),
  };
}
