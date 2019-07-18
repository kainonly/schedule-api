import * as V from 'joi';
import { ValidatePipe } from './common/validate.pipe';
import { FindOneOptions, ObjectID, Repository } from 'typeorm';

const Validate = (schema: any) => new ValidatePipe(schema);

interface CurdGetArgs {
  id: string | number | Date | ObjectID;
  options?: FindOneOptions<any>;

  before?(): boolean;

  beforeResponse?: any;
}

const CurdGet = async (repository: Repository<any>, args: CurdGetArgs) => {
  try {
    if (Reflect.has(args, 'before')
      && !args.before()) {
      return Reflect.has(args, 'beforeResponse') ?
        args.beforeResponse : { error: 1 };
    }

    const data = await repository.findOne({
      where: {
        id: args.id,
      },
    });
    return data ? {
      error: 0,
      data,
    } : {
      error: 0,
      data: {},
    };
  } catch (e) {
    return {
      error: 1,
      msg: e.toString(),
    };
  }
};

export { Validate, V, CurdGet };
