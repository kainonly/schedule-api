import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { AppValidation } from './app.validation';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get()
  index() {
    return [];
  }

  @Get('get')
  @UsePipes(new AppValidation({
    required: ['identity'],
    properties: {
      identity: {
        type: 'string',
      },
    },
  }))
  get(@Query() query: any) {
    const result = this.appService.get(query.identity);
    return result ? {
      error: 0,
      data: result,
    } : {
      error: 1,
      msg: 'not exists',
    };
  }

  @Get('lists')
  lists() {
    return [];
  }

  @Post('create')
  @UsePipes(new AppValidation({
    required: ['identity', 'cronTime', 'bash'],
    properties: {
      identity: {
        type: 'string',
      },
      cronTime: {
        type: 'string',
      },
      bash: {
        type: 'string',
      },
    },
  }))
  create(@Body() body: any) {
    const result = this.appService.create(body);
    return result ? {
      error: 0,
      msg: 'ok',
    } : {
      error: 1,
      msg: 'failed',
    };
  }

  @Post('update')
  update() {
    return [];
  }

  @Post('delete')
  delete() {
    return [];
  }

  @Post('start')
  start() {
    return [];
  }

  @Post('stop')
  stop() {
    return [];
  }
}
