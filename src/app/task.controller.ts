import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CurdService } from '../common/curd.service';
import { Validate, V } from '../helper';

@Controller('task')
export class TaskController {
  constructor(
    private curd: CurdService,
  ) {
  }

  @Post('get')
  @UsePipes(Validate({
    id: V.string().required(),
  }))
  async get(@Body() body: any): Promise<any> {
    try {
      const data = await this.curd.task.findOne(body.id);
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
    skip: V.number().required(),
  }))
  async lists(): Promise<any> {
    try {
      const data = await this.curd.task.find({
        skip: 1,
        take: 2,
        order: {
          create_time: 'DESC',
        },
      });
      return data ? {
        error: 0,
        data: {
          lists: data,
          total: data.length,
        },
      } : {
        error: 0,
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
    status: V.boolean(),
  }))
  async add(@Body() body: any): Promise<any> {
    try {
      const result = await this.curd.task.insert({
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
      await this.curd.task.update(id, body);
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
      await this.curd.task.delete(body.id);
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
