import * as V from 'joi';
import { ValidatePipe } from './common/validate.pipe';

const Validate = (schema: any) => new ValidatePipe(schema);

export { Validate, V };
