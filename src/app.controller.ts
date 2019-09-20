import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JobsService } from './service/jobs.service';
import { ValidationPipe } from './common/validation.pipe';

@Controller()
export class AppController {
  constructor(
    private readonly jobsService: JobsService,
  ) {
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
  put(@Body() body: any) {
    const result = this.jobsService.put(body);
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
  delete(@Body() body: any) {
    const result = this.jobsService.delete(body.identity);
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
  status(@Body() body: any) {
    const result = body.status ?
      this.jobsService.start(body.identity) :
      this.jobsService.stop(body.identity);
    return result ? {
      error: 0,
      msg: 'ok',
    } : {
      error: 1,
      msg: 'failed',
    };
  }
}
