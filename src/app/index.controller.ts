import { Controller, Get } from '@nestjs/common';

@Controller()
export class IndexController {
  @Get()
  getHealth(): any {
    return {
      status: 1,
    };
  }
}
