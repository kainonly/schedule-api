import { Body, Controller, Param, Post, UsePipes } from '@nestjs/common';
import { ValidateTypeOfGet } from '../helper';

@Controller()
export class MainController {
  @Post()
  @UsePipes(ValidateTypeOfGet({}))
  index(@Body() body: any): any {
    return {
      status: 1,
    };
  }
}
