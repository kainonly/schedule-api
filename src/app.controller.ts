import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { JobsService } from './service/jobs.service';
import { ValidationPipe } from './common/validation.pipe';

@Controller()
export class AppController {
  constructor(
    private readonly jobsService: JobsService,
  ) {
  }

  @Get('lists')
  lists() {
    return [];
  }

  @Get('get')
  @UsePipes(new ValidationPipe({
    required: ['identity'],
    properties: {
      identity: {
        type: 'string',
      },
    },
  }))
  get(@Query() query: any) {
    const result = this.jobsService.get(query.identity);
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
    required: ['identity', 'time', 'bash'],
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
  delete(@Body() body: any) {
    return [];
  }

  @Post('status')
  status(@Body() body: any) {
    return [];
  }
}
