import { Body, Controller, OnApplicationShutdown, Post, UsePipes } from '@nestjs/common';
import { JobsService } from './service/jobs.service';
import { ValidationPipe } from './common/validation.pipe';
import { StorageService } from './service/storage.service';

@Controller()
export class AppController implements OnApplicationShutdown {
  constructor(
    private readonly jobsService: JobsService,
    private readonly storageService: StorageService,
  ) {
  }

  onApplicationShutdown(signal?: string): any {
    console.log(this.jobsService.getRunTime());
    console.log(this.jobsService.getJobs());
  }

  @Post('lists')
  @UsePipes(new ValidationPipe({
    required: ['identity'],
    properties: {
      identity: {
        type: 'array',
      },
    },
  }))
  lists(@Body() body: any) {
    const lists = body.identity.map(v => this.jobsService.get(v));
    return {
      error: 0,
      data: lists,
    };
  }

  @Post('get')
  @UsePipes(new ValidationPipe({
    required: ['identity'],
    properties: {
      identity: {
        type: 'string',
      },
    },
  }))
  get(@Body() body: any) {
    const result = this.jobsService.get(body.identity);
    return result ? {
      error: 0,
      data: result,
    } : {
      error: 1,
      msg: 'not exists',
    };
  }

  @Post('put')
  @UsePipes(new ValidationPipe({
    required: ['identity', 'time', 'bash', 'start', 'zone'],
    properties: {
      identity: {
        type: 'string',
      },
      time: {
        type: 'string',
      },
      bash: {
        type: 'string',
      },
      start: {
        type: 'boolean',
      },
      zone: {
        type: 'string',
      },
    },
  }))
  async put(@Body() body: any) {
    const result = this.jobsService.put(body);
    await this.storageService.add({
      type: 'put',
      raws: body,
      status: result,
      createTime: new Date(),
    });
    return result ? {
      error: 0,
      msg: 'ok',
    } : {
      error: 1,
      msg: 'failed',
    };
  }

  @Post('delete')
  @UsePipes(new ValidationPipe({
    required: ['identity'],
    properties: {
      identity: {
        type: 'string',
      },
    },
  }))
  async delete(@Body() body: any) {
    const result = this.jobsService.delete(body.identity);
    await this.storageService.add({
      type: 'delete',
      raws: body,
      status: result,
      createTime: new Date(),
    });
    return result ? {
      error: 0,
      msg: 'ok',
    } : {
      error: 1,
      msg: 'failed',
    };
  }

  @Post('status')
  @UsePipes(new ValidationPipe({
    required: ['identity', 'status'],
    properties: {
      identity: {
        type: 'string',
      },
      status: {
        type: 'boolean',
      },
    },
  }))
  async status(@Body() body: any) {
    const result = body.status ?
      this.jobsService.start(body.identity) :
      this.jobsService.stop(body.identity);
    await this.storageService.add({
      type: 'status',
      raws: body,
      status: result,
      createTime: new Date(),
    });
    return result ? {
      error: 0,
      msg: 'ok',
    } : {
      error: 1,
      msg: 'failed',
    };
  }
}
