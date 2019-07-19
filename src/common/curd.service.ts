import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScriptTaskEntity } from '../database/script-task.entity';
import { ApiTaskEntity } from '../database/api-task.entity';
import { QueueTaskEntity } from '../database/queue-task.entity';
import { V, Validate } from '../helper';

@Injectable()
export class CurdService {
  static GetValidate(schema?: any) {
    return Validate(Object.assign({
      id: V.string().required(),
    }, schema));
  }

  static async Get(repository: Repository<any>, body: any) {
    try {
      const data = await repository.findOne({
        where: {
          id: body.id,
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
  }

  static ListsValidate(schema?: any) {
    return Validate(Object.assign({
      page: {
        limit: V.number().required(),
        index: V.number().required(),
      },
    }, schema));
  }

  static async Lists(repository: Repository<any>, body: any) {
    try {
      const size = await repository.count();
      const data = await repository.find({
        take: body.page.limit,
        skip: body.page.index,
        order: {
          create_time: 'DESC',
        },
      });
      return data ? {
        error: 0,
        data: {
          lists: data,
          total: size,
        },
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
  }

  static async Add(repository: Repository<any>, body: any) {
    try {
      const data: any = Object.assign(body, {
        create_time: new Date(),
        update_time: new Date(),
      });
      const result = await repository.insert(data);
      return result.identifiers.length !== 0 ? {
        error: 0,
        msg: 'ok',
      } : {
        error: 1,
        msg: 'failed',
      };
    } catch (e) {
      return {
        error: 1,
        msg: e.toString(),
      };
    }
  }

  static EditValidate(schema?: any) {
    return Validate(Object.assign({
      id: V.string().required(),
    }, schema));
  }

  static async Edit(repository: Repository<any>, body: any) {
    try {
      const id = body.id;
      delete body.id;
      body.update_time = new Date();
      await repository.update(id, body);
      return {
        error: 0,
        msg: 'ok',
      };
    } catch (e) {
      return {
        error: 1,
        msg: e.toString(),
      };
    }
  }

  static DeleteValidate(schema?: any) {
    return Validate(Object.assign({
      id: V.string().required(),
    }, schema));
  }

  static async Delete(repository: Repository<any>, body: any) {
    try {
      await repository.delete(body.id);
      return {
        error: 0,
        msg: 'ok',
      };
    } catch (e) {
      return {
        error: 1,
        msg: e.toString(),
      };
    }
  }

  constructor(
    @InjectRepository(ScriptTaskEntity)
    public readonly scriptTask: Repository<ScriptTaskEntity>,
    @InjectRepository(ApiTaskEntity)
    public readonly apiTask: Repository<ApiTaskEntity>,
    @InjectRepository(QueueTaskEntity)
    public readonly queueTask: Repository<QueueTaskEntity>,
  ) {
  }

}
