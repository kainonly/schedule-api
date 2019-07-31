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

const ValidateTypeLists = (schema?: any) => Validate(Object.assign({
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

const EditValidate = (schema?: any) => Validate(Object.assign({
  required: ['id'],
  properties: {
    id: {
      type: 'number',
    },
  },
}, schema));

const DeleteValidate = (schema?: any) => Validate(Object.assign({
  required: ['id'],
  properties: {
    id: {
      type: 'number',
    },
  },
}, schema));

export { Validate, ValidateTypeOfGet, ValidateTypeLists, EditValidate, DeleteValidate };
