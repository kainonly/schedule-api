import { Repository } from 'typeorm';

export class CurdFactory {
  constructor(
    private repository: Repository<any>,
  ) {
  }

  async get(body: any) {
    try {
      const conditions = Reflect.has(body, 'id') ? body.id : body.where;
      const data = await this.repository.findOne(conditions);
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

  async lists(body: any) {
    try {
      const conditions = Reflect.has(body, 'where') ? body.where : {};
      const size = await this.repository.count(conditions);
      const data = await this.repository.find({
        where: conditions,
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

  async add(body: any) {
    try {
      const data: any = Object.assign(body, {
        create_time: new Date(),
        update_time: new Date(),
      });
      const result = await this.repository.insert(data);
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

  async edit(body: any) {
    try {
      const id = body.id;
      delete body.id;
      body.update_time = new Date();
      await this.repository.update(id, body);
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

  async delete(body: any) {
    try {
      await this.repository.delete(body.id);
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
}
