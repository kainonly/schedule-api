import * as Joi from 'joi';

export class TaskValidate {
  static get = {
    id: Joi.string().required(),
  };

  static lists = {};

  static add = {
    job_name: Joi.string().required(),
    cron: Joi.string().required(),
  };

  static update = {
    id: Joi.string().required(),
    job_name: Joi.string(),
    cron: Joi.string(),
  };

  static delete = {
    id: Joi.string().required(),
  };
}
