import { ValidatePipe } from './common/validate.pipe';

const Validate = (schema: any) => new ValidatePipe(schema);

const ValidateTypeOfGet = (schema?: any) => Validate(Object.assign({
  required: ['id'],
  properties: {
    id: {
      type: 'number',
    },
  },
}, schema));

const ValidateTypeOfLists = (schema?: any) => Validate(Object.assign({
  required: ['where', 'page'],
  properties: {
    where: {
      type: 'array',
    },
    page: {
      type: 'object',
    },
  },
}, schema));

const ValidateTypeOfEdit = (schema?: any) => Validate(Object.assign({
  required: ['id'],
  properties: {
    id: {
      type: 'number',
    },
  },
}, schema));

const ValidateTypeOfDelete = (schema?: any) => Validate(Object.assign({
  required: ['id'],
  properties: {
    id: {
      type: 'number',
    },
  },
}, schema));

export {
  Validate,
  ValidateTypeOfGet,
  ValidateTypeOfLists,
  ValidateTypeOfEdit,
  ValidateTypeOfDelete,
};
