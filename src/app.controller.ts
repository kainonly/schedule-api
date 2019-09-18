import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

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
  get() {
    return [];
  }

  @Get('lists')
  lists() {
    return [];
  }

  @Post('create')
  create() {
    return [];
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
