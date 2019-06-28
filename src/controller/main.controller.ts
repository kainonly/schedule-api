import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  @Get()
  getHealth(): any {
    return {
      status: 1,
    };
  }
}
