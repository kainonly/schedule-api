import { Body, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CurdGet, V, Validate } from '../helper';

export abstract class BaseController {
  constructor(
    private repository: Repository<any>,
  ) {
  }

  @HttpCode(400)
  @Post('get')
  @UsePipes(Validate({
    id: V.string().required(),
  }))
  get(@Body() body: any): Promise<any> {
    return CurdGet(this.repository, {
      id: body.id,
    });
  }
}
