import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { DatabaseService } from '../common/database.service';
import { Validate, V } from '../helper';

@Controller('api-task')
export class ApiTaskController {
  constructor(
    private database: DatabaseService,
  ) {
  }

  @Post('get')
  @UsePipes(Validate({
    id: V.string().required(),
  }))
  async get(@Body() body: any): Promise<any> {
    try {
      const data = await this.database.apiTask.findOne(body.id);
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

  @Post('lists')
  @UsePipes(Validate({
    page: {
      limit: V.number().required(),
      index: V.number().required(),
    },
  }))
  async lists(@Body() body: any): Promise<any> {
    try {
      const size = await this.database.apiTask.count();
      const data = await this.database.apiTask.find({
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

  @Post('add')
  @UsePipes(Validate({
    job_name: V.string().required(),
    cron: V.string().required(),
    timezone: V.string().required(),
    status: V.boolean(),
  }))
  async add(@Body() body: any): Promise<any> {
    try {
      const result = await this.database.apiTask.insert({
        job_name: body.job_name,
        cron: body.cron,
        status: true,
        create_time: new Date(),
        update_time: new Date(),
      });
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

  @Post('update')
  @UsePipes(Validate({
    id: V.string().required(),
    job_name: V.string(),
    cron: V.string(),
    status: V.boolean(),
  }))
  async update(@Body() body: any): Promise<any> {
    try {
      const id = body.id;
      delete body.id;
      body.update_time = new Date();
      await this.database.apiTask.update(id, body);
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

  @Post('delete')
  @UsePipes(Validate({
    id: V.string().required(),
  }))
  async delete(@Body() body: any): Promise<any> {
    try {
      await this.database.apiTask.delete(body.id);
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
