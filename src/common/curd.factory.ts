import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

export class CurdFactory {
  constructor(
    private repository: Repository<any>,
  ) {
  }

  async get(body: any) {
    try {
      const conditions = Reflect.has(body, 'id') ? body.id : body.where;
      const data = await this.repository.findOne(conditions);
      return {
        error: 0,
        data,
      };
    } catch (e) {
      return new BadRequestException({
        error: 1,
        msg: e.toString(),
      });
    }
  }

  async lists(body: any) {
    try {
      const conditions = Reflect.has(body, 'where') ? body.where : null;
      const [data, size] = await this.repository.findAndCount({
        where: conditions,
        take: body.page.limit,
        skip: body.page.index,
        order: {
          create_time: 'DESC',
        },
      });
      return {
        error: 0,
        data: {
          lists: data,
          total: size,
        },
      };
    } catch (e) {
      return new BadRequestException({
        error: 1,
        msg: e.toString(),
      });
    }
  }

  async add(body: any) {
    try {
      const data: any = Object.assign(body, {
        create_time: new Date(),
        update_time: new Date(),
      });
      const result = await this.repository.insert(data);
      return {
        error: 0,
        result: {
          identifiers: result.identifiers,
        },
      };
    } catch (e) {
      return new BadRequestException({
        error: 1,
        msg: e.toString(),
      });
    }
  }

  async edit(body: any) {
    try {
      const id = body.id;
      Reflect.deleteProperty(body, 'id');
      body.update_time = new Date();
      const result = await this.repository.update(id, body);
      return {
        error: 0,
        result,
      };
    } catch (e) {
      return new BadRequestException({
        error: 1,
        msg: e.toString(),
      });
    }
  }

  async delete(body: any) {
    try {
      const result = await this.repository.delete(body.id);
      return {
        error: 0,
        result,
      };
    } catch (e) {
      return new BadRequestException({
        error: 1,
        msg: e.toString(),
      });
    }
  }
}
