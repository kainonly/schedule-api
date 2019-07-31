import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  @Get()
  index(): any {
    return {
      status: 1,
    };
  }
}
