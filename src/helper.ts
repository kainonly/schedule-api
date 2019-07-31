import { ValidatePipe } from './common/validate.pipe';

const validate = (schema: any) => new ValidatePipe(schema);

const validateTypeOfGet = (schema?: any) => {
  return validate({
    properties: {
      id: {
        type: 'number',
      },
      where: {
        type: 'object',
      },
    },
  });
};

// const ListsValidate = (schema?: any) => {
//   return Validate(Object.assign({
//     where: V.object(),
//     page: {
//       limit: V.number().required(),
//       index: V.number().required(),
//     },
//   }, schema));
// };
//
// const EditValidate = (schema?: any) => {
//   return Validate(Object.assign({
//     id: V.string().required(),
//   }, schema));
// };
//
// const DeleteValidate = (schema?: any) => {
//   return Validate(Object.assign({
//     id: V.string().required(),
//   }, schema));
// };

export { validate, validateTypeOfGet };
